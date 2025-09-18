// scripts/cypress-report.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import cypress from "cypress";
import { merge } from "mochawesome-merge";
import marge from "mochawesome-report-generator";

import { createRequire } from "node:module";
const requireCjs = createRequire(import.meta.url);

// Absolute path to the project's nyc CLI (from node_modules)
const nycBin = requireCjs.resolve("nyc/bin/nyc.js");

// Helper to run: node <nycBin> report <args...>
async function runNYC(cwd, env, args) {
    return pexecFile(process.execPath, [nycBin, "report", ...args], { cwd, env });
}


const pexecFile = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Config you can tweak ---
const projectRoot = path.resolve(__dirname, ".."); // SENG3150-Project
const resultsRoot = path.join(projectRoot, "test-results");

// Make timestamp dir: YYYY-MM-DD_HH-mm-ss
const pad = n => String(n).padStart(2, "0");
const now = new Date();
const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

const runDir = path.join(resultsRoot, stamp);
const mochawesomeDir = path.join(runDir, "mochawesome");
const coverageDir = path.join(runDir, "coverage");
const junitDir = path.join(runDir, "junit");
fs.mkdirSync(mochawesomeDir, { recursive: true });
fs.mkdirSync(junitDir, { recursive: true });

const reporter = "cypress-multi-reporters";
const reporterOptions = {
    reporterEnabled: "spec, mocha-junit-reporter, mochawesome",
    mochaJunitReporterReporterOptions: {
        mochaFile: path.join(junitDir, "junit-[hash].xml"),
        toConsole: false
    },
    mochawesomeReporterOptions: {
        reportDir: mochawesomeDir,
        overwrite: false,
        html: true,
        json: true
    }
};

// Optional: restrict per-spec denominators to files we care about (by spec name).
// Keys are RegExp strings matched against specRel (e.g. "cypress/e2e/login.cy.js").
// Values are arrays of regexes matched against absolute source file paths.
const PER_SPEC_FILE_FILTERS = [
    {
        specPattern: /login\.cy\.(t|j)sx?$/i,
        keep: [
            /[/\\]src[/\\](pages|routes)[/\\]login[/\\]/i,
            /[/\\]src[/\\]features[/\\]auth[/\\]/i,
            /[/\\]src[/\\]components[/\\]login/i
        ]
    },
    {
        specPattern: /register\.cy\.(t|j)sx?$/i,
        keep: [
            /[/\\]src[/\\](pages|routes)[/\\]register[/\\]/i,
            /[/\\]src[/\\]features[/\\]auth[/\\]/i,
            /[/\\]src[/\\]components[/\\]register/i
        ]
    }
    // Add more spec→file filters as needed
];

function applyPerSpecKeepFilters(specRel, mergedCoverageObj) {
    const entry = PER_SPEC_FILE_FILTERS.find(e => e.specPattern.test(specRel));
    if (!entry) return mergedCoverageObj; // no filter for this spec → keep all touched files
    const out = {};
    for (const [absPath, cov] of Object.entries(mergedCoverageObj)) {
        if (entry.keep.some(rx => rx.test(absPath))) out[absPath] = cov;
    }
    return out;
}

try {
    // Ensure a clean NYC output for this run
    const nycOutput = path.join(projectRoot, ".nyc_output");
    fs.rmSync(nycOutput, { recursive: true, force: true });
    fs.mkdirSync(nycOutput, { recursive: true });

    // Run Cypress (ALL SPECS) with coverage instrumentation enabled
    const cyResult = await cypress.run({
        project: projectRoot,
        reporter,
        reporterOptions,
        env: { codeCoverage: true },
        config: {
            // Optional: pass baseUrl, configFile, etc.
        }
        // Cypress inherits env like CYPRESS_COVERAGE from this process
    });

    // Merge mochawesome JSON -> single HTML
    const jsonReport = await merge({ files: [path.join(mochawesomeDir, "*.json")] });
    const mergedHtml = await marge.create(jsonReport, {
        reportDir: mochawesomeDir,
        reportFilename: "merged-report",
        inline: true,
        charts: true
    });

    // --- GLOBAL COVERAGE: lcov + html + text-summary --------------------------
    const env = { ...process.env, CYPRESS_COVERAGE: "1" };
    const isWin = process.platform === "win32";
    const npxBin = isWin ? "npx.cmd" : "npx";

    // lcov + html
    await runNYC(projectRoot, env, [
        "--reporter=lcov",
        "--reporter=html",
        `--report-dir=${coverageDir}`
    ]);

    // text-summary (GLOBAL TOTALS)
    const { stdout: textSummary } = await runNYC(projectRoot, env, [
        "--reporter=text-summary"
    ]);
    fs.writeFileSync(path.join(runDir, "coverage-summary.txt"), textSummary);

    // --- PER-SPEC COVERAGE: run each spec individually (with filtering + pruning)
    const runs = Array.isArray(cyResult?.runs) ? cyResult.runs : [];
    const perSpecDir = path.join(runDir, "per-spec-coverage");
    fs.mkdirSync(perSpecDir, { recursive: true });

    const perSpecIndex = [];

    for (let i = 0; i < runs.length; i++) {
        const specRel = runs[i]?.spec?.relative || runs[i]?.spec?.name;
        if (!specRel) continue;

        // Clean nyc before each spec-only run
        fs.rmSync(nycOutput, { recursive: true, force: true });
        fs.mkdirSync(nycOutput, { recursive: true });

        // Run just this spec (minimal reporter to keep this quick)
        await cypress.run({
            project: projectRoot,
            spec: specRel,
            reporter: "spec",
            env: { codeCoverage: true }
        });

        // Merge raw coverage for this spec
        const rawFiles = fs.readdirSync(nycOutput).filter(f => f.endsWith(".json"));
        let mergedRaw = {};
        for (const f of rawFiles) {
            const data = JSON.parse(fs.readFileSync(path.join(nycOutput, f), "utf8"));
            mergedRaw = { ...mergedRaw, ...data }; // shallow merge by file path keys
        }

        // Apply optional per-spec keep filters (route-scoped focus)
        const filtered = applyPerSpecKeepFilters(specRel, mergedRaw);
        const sourceForPrune = Object.keys(filtered).length ? filtered : mergedRaw;

        // PRUNE: keep only files with ≥1 covered statement (after filtering)
        const pruned = {};
        for (const [filePath, cov] of Object.entries(sourceForPrune)) {
            const s = cov?.s || {};
            const coveredCount = Object.values(s).filter(v => v > 0).length;
            if (coveredCount > 0) pruned[filePath] = cov;
        }

        // Write pruned coverage into a temp per-spec .nyc_output and run nyc there
        const tmpPerSpecRoot = path.join(perSpecDir, `spec-${String(i + 1).padStart(2, "0")}`);
        const tmpNycOut = path.join(tmpPerSpecRoot, ".nyc_output");
        const tmpReportDir = path.join(tmpPerSpecRoot, "coverage");
        fs.mkdirSync(tmpNycOut, { recursive: true });
        fs.mkdirSync(tmpReportDir, { recursive: true });
        fs.writeFileSync(path.join(tmpNycOut, "out.json"), JSON.stringify(pruned));

        await runNYC(tmpPerSpecRoot, env, [
            "--reporter=json-summary",
            `--report-dir=${tmpReportDir}`
        ]);


        const summaryPath = path.join(tmpReportDir, "coverage-summary.json");
        const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
        const total = summary.total || { statements:{}, branches:{}, functions:{}, lines:{} };

        // Pretty .txt like the global summary
        const safeName = specRel.replace(/[\\/]/g, "_");
        const specTxtPath = path.join(perSpecDir, `${safeName}.txt`);
        const txt = `
=============================== Coverage summary ===============================
Statements   : ${total.statements.pct ?? 0}% (${total.statements.covered ?? 0}/${total.statements.total ?? 0})
Branches     : ${total.branches.pct ?? 0}% (${total.branches.covered ?? 0}/${total.branches.total ?? 0})
Functions    : ${total.functions.pct ?? 0}% (${total.functions.covered ?? 0}/${total.functions.total ?? 0})
Lines        : ${total.lines.pct ?? 0}% (${total.lines.covered ?? 0}/${total.lines.total ?? 0})
================================================================================
`;
        fs.writeFileSync(specTxtPath, txt.trimStart());
        perSpecIndex.push({ spec: specRel, path: specTxtPath });
    }

    // Append an index of per-spec summaries into summary.txt
    const indexBlock = `
Per-Spec Coverage Summaries
---------------------------
${perSpecIndex.map(s => `- ${s.spec}: ${s.path}`).join("\n")}
`;
    fs.appendFileSync(path.join(runDir, "summary.txt"), indexBlock + "\n");

    // --- TEST SUMMARY (kept last to preserve layout) --------------------------
    const totals = {
        totalTests: cyResult.totalTests ?? 0,
        totalPassed: cyResult.totalPassed ?? 0,
        totalFailed: cyResult.totalFailed ?? 0,
        totalPending: cyResult.totalPending ?? 0,
        totalSkipped: cyResult.totalSkipped ?? 0,
        startedTestsAt: cyResult.startedTestsAt,
        endedTestsAt: cyResult.endedTestsAt,
        cypressVersion: cyResult.cypressVersion
    };
    fs.writeFileSync(path.join(runDir, "summary.json"), JSON.stringify(totals, null, 2));
    fs.writeFileSync(
        path.join(runDir, "summary.txt"),
        `Cypress Summary
================
Started: ${totals.startedTestsAt}
Ended:   ${totals.endedTestsAt}

Total:   ${totals.totalTests}
Passed:  ${totals.totalPassed}
Failed:  ${totals.totalFailed}
Pending: ${totals.totalPending}
Skipped: ${totals.totalSkipped}

JUnit XML: ${path.join(junitDir, "junit-[hash].xml")}
HTML report: ${mergedHtml}
Coverage: ${path.join(coverageDir, "lcov-report/index.html")}
`,
        { flag: "w" } // keep global summary at top; per-spec index is appended earlier
    );

    console.log(`\n✅ Reports + coverage saved to: ${runDir}\n`);
    process.exitCode = cyResult.totalFailed > 0 ? 1 : 0;
} catch (err) {
    console.error("❌ Cypress report run failed:", err);
    process.exit(1);
}

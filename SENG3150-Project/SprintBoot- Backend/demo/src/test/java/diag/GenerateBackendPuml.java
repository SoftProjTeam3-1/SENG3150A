package diag;


//npm run uml


import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Generates a PlantUML class diagram by reflecting over compiled classes.
 * No external libraries. Works in multi-module layouts.
 */
public class GenerateBackendPuml {

    // TODO: set your real base package(s)
    private static final List<String> ROOT_PACKAGES = List.of(
            "com.example" // e.g. "au.uon.seng3150", "com.yourorg.project"
    );

    private static final String DEFAULT_OUT_DIR = "../../../../../Documentation/diagrams/src/out";;

    public static void main(String[] args) throws Exception {
        String outDir  = args.length > 0 ? args[0] : DEFAULT_OUT_DIR;
        String outFile = Paths.get(outDir, "backend-classes.puml").toString();

        Path compiledRoot = findCompiledRoot();  // <-- key change
        System.out.println("Using compiled classes at: " + compiledRoot);

        // Build classloader over compiled roots (test-classes + classes if both exist)
        List<URL> urls = new ArrayList<>();
        urls.add(compiledRoot.toUri().toURL());
        Path mainClasses = compiledRoot.resolveSibling("classes");
        if (Files.isDirectory(mainClasses) && !mainClasses.equals(compiledRoot)) {
            urls.add(mainClasses.toUri().toURL());
        }

        try (URLClassLoader loader =
                     new URLClassLoader(urls.toArray(new URL[0]),
                             Thread.currentThread().getContextClassLoader())) {

            // Find all FQCNs under compiledRoot matching our packages
            List<String> fqcnList = new ArrayList<>();
            Files.walk(compiledRoot)
                    .filter(p -> p.toString().endsWith(".class"))
                    .forEach(p -> {
                        String rel = compiledRoot.relativize(p).toString();
                        String name = rel.substring(0, rel.length() - ".class".length())
                                .replace('/', '.').replace('\\', '.');
                        if (name.contains("$")) return;                  // skip inner/anon classes
                        if (startsWithAny(name, ROOT_PACKAGES)) {
                            fqcnList.add(name);
                        }
                    });

            List<Class<?>> classes = fqcnList.stream()
                    .map(n -> tryLoad(loader, n))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            StringBuilder sb = new StringBuilder();
            sb.append("@startuml\n");
            sb.append("!theme plain\n");
            sb.append("hide empty members\n");
            sb.append("skinparam classAttributeIconSize 0\n");

            // Declarations + public members
            for (Class<?> c : classes) {
                String simple = c.getSimpleName();
                String fqcn   = c.getName();
                if (c.isInterface()) {
                    sb.append("interface ").append(simple).append(" as \"").append(fqcn).append("\"\n");
                } else if (c.isEnum()) {
                    sb.append("enum ").append(simple).append(" as \"").append(fqcn).append("\"\n");
                } else {
                    sb.append("class ").append(simple).append(" as \"").append(fqcn).append("\"\n");
                }

                List<String> fields = Arrays.stream(c.getDeclaredFields())
                        .filter(f -> Modifier.isPublic(f.getModifiers()))
                        .map(f -> "  +" + f.getName() + " : " + friendlyType(f.getType()))
                        .collect(Collectors.toList());

                List<String> methods = Arrays.stream(c.getDeclaredMethods())
                        .filter(m -> Modifier.isPublic(m.getModifiers()))
                        .filter(m -> !m.isSynthetic() && !m.getName().startsWith("lambda$"))
                        .map(m -> "  +" + m.getName() + "(" +
                                Arrays.stream(m.getParameterTypes()).map(GenerateBackendPuml::friendlyType)
                                        .collect(Collectors.joining(", ")) +
                                ") : " + friendlyType(m.getReturnType()))
                        .collect(Collectors.toList());

                if (!fields.isEmpty() || !methods.isEmpty()) {
                    sb.append(simple).append(" {\n");
                    fields.forEach(line -> sb.append(line).append("\n"));
                    if (!fields.isEmpty() && !methods.isEmpty()) sb.append("--\n");
                    methods.forEach(line -> sb.append(line).append("\n"));
                    sb.append("}\n");
                }
            }

            // Extends / Implements
            for (Class<?> c : classes) {
                String from = c.getSimpleName();
                Class<?> sup = c.getSuperclass();
                if (sup != null && startsWithAny(sup.getName(), ROOT_PACKAGES)) {
                    sb.append(sup.getSimpleName()).append(" <|-- ").append(from).append("\n");
                }
                for (Class<?> iface : c.getInterfaces()) {
                    if (startsWithAny(iface.getName(), ROOT_PACKAGES)) {
                        sb.append(iface.getSimpleName()).append(" <|.. ").append(from).append("\n");
                    }
                }
            }

            // Simple field associations
            for (Class<?> c : classes) {
                String from = c.getSimpleName();
                for (Field f : c.getDeclaredFields()) {
                    Class<?> t = f.getType();
                    if (t != null && startsWithAny(t.getName(), ROOT_PACKAGES)) {
                        sb.append(from).append(" --> ").append(t.getSimpleName()).append("\n");
                    }
                }
            }

            sb.append("@enduml\n");

            Files.createDirectories(Paths.get(outDir));
            Files.writeString(Paths.get(outFile), sb.toString());
            System.out.println("Wrote " + outFile);
        }
    }

    /** Resolve target/test-classes (or classes) based on where THIS test class is loaded from. */
    private static Path findCompiledRoot() throws URISyntaxException {
        URL codeSource = GenerateBackendPuml.class.getProtectionDomain()
                .getCodeSource().getLocation();
        Path loc = Paths.get(codeSource.toURI()); // usually .../target/test-classes
        if (Files.isDirectory(loc)) return loc;
        // Fallbacks
        Path tc = Paths.get("target", "test-classes");
        if (Files.isDirectory(tc)) return tc;
        Path mc = Paths.get("target", "classes");
        if (Files.isDirectory(mc)) return mc;
        throw new IllegalStateException("Compiled classes not found. Run mvn test-compile or mvn compile first.");
    }

    private static boolean startsWithAny(String s, List<String> prefixes) {
        for (String p : prefixes) if (s.startsWith(p)) return true;
        return false;
    }

    private static String friendlyType(Class<?> t) {
        if (t.isArray()) return friendlyType(t.getComponentType()) + "[]";
        String n = t.getName();
        int i = n.lastIndexOf('.');
        return i >= 0 ? n.substring(i + 1) : n;
    }

    private static Class<?> tryLoad(ClassLoader loader, String name) {
        try { return Class.forName(name, false, loader); }
        catch (Throwable ignored) { return null; }
    }
}

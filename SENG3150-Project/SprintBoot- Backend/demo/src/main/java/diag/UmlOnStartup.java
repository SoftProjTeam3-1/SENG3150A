// src/main/java/diag/UmlOnStartup.java
package diag;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.nio.file.Path;

@Component
public class UmlOnStartup implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {

        GenerateBackendPuml.main();

        // render SVG
        GenerateBackendPuml.writeSvg();

    }
}

package diag;


//npm run uml
// Change to do it when the backend is ran (SpringBoot)

import net.sourceforge.plantuml.*;
import org.springframework.data.util.Pair;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Stream;

import static diag.RelationType.EXTENDS;
import static diag.RelationType.IMPLEMENTS;
import static diag.RelationType.ASSOCIATION;
import static diag.RelationType.DEPENDENCY;

public class GenerateBackendPuml {

    private static final String outputFilePath = "SENG3150-Project/Documentation/diagrams/src";
    static ArrayList<String> classFiles = new ArrayList<>();

//    static Map<String, Set<String>> extendMap = new HashMap<>();
//    static Map<String, Set<String>> implementMap = new HashMap<>();
//    static Map<String, Set<String>> assoicationMap = new HashMap<>();
//    static Map<String, Set<String>> dependencyMap = new HashMap<>();

    static Map<Pair<String,String>, RelationType> relationMap = new HashMap<>();

    public static void main() {

        List<String> pkg = List.of("com.example");

        System.out.println("Generating Backend Puml");

        List<String> inputDirectory = new ArrayList<>();
        inputDirectory.add("SENG3150-Project");
        inputDirectory.add("SprintBoot-Backend");
        inputDirectory.add("demo");
        inputDirectory.add("target");
        inputDirectory.add("classes");

        Path outputPath = getRootClassDirectory(Optional.of(inputDirectory));
        System.out.println(outputPath);
        classFiles = scanClassFiles(outputPath);

        String content = generatePumlContent();
        createNewPumlFile(outputFilePath, content);
    }


    // Input: Package, Helps path to class location (auto-detects Maven/Gradle)
    // Output: Path of class directory (backend)
    private static Path getRootClassDirectory(Optional<List<String>> customDirectory) {
        Path base = Paths.get("").toAbsolutePath();
        Path compiledRoot = base;

        if (customDirectory.isPresent()) {

            for(String dircetoryName : customDirectory.get()) {
                compiledRoot = compiledRoot.resolve(dircetoryName);
            }

        }else{
            compiledRoot = Paths.get("demo", "target", "classes", "com", "example");
        }

        return compiledRoot;
    }


    // Input: Classes pathway
    // Output: Arraylist of all class file directory's
    private static ArrayList<String> scanClassFiles(Path directory) {
        ArrayList<String> classFiles = new ArrayList<>();

        try(Stream<Path> stream = Files.walk(directory)) {
            stream
                    .filter(p -> p.toString().endsWith(".class"))
                    .filter(p -> !p.getFileName().toString().contains("$"))
                    .forEach(p -> {

                        String relativePath = directory.relativize(p).toString().replace(File.separatorChar, '.');

                        String item = relativePath.substring(0, relativePath.length() - ".class".length());

                        classFiles.add(item);
                    });
        } catch (IOException e) {
            throw new RuntimeException(e);
        }


        return classFiles;
    }

    // Input: None (Uses global var list classFiles)
    // Output: string of content for puml file
    static String generatePumlContent() {
        StringBuilder sb  = new StringBuilder();

        sb.append("@startuml\n\n" +
                "skinparam dpi 600\n");

        for(String classFile : classFiles) {
            sb.append(getUmlDeclaration(classFile)).append("\n");
        }
//
//        for (var entry : extendMap.entrySet()) {
//            String parent = entry.getKey();
//            for (String child : entry.getValue()) {
//                sb.append(parent).append(" <|-- ").append(child).append("\n");
//            }
//        }
//
//        for (var entry : implementMap.entrySet()) {
//            String parent = entry.getKey();
//            for (String child : entry.getValue()) {
//                sb.append(parent).append(" <|.. ").append(child).append("\n");
//            }
//        }
//
//        for (var entry : assoicationMap.entrySet()) {
//            String parent = entry.getKey();
//            for (String child : entry.getValue()) {
//                sb.append(parent).append(" --> ").append(child).append("\n");
//            }
//        }
//
//        for (var entry : dependencyMap.entrySet()) {
//            String parent = entry.getKey();
//            for (String child : entry.getValue()) {
//                sb.append(parent).append(" ..> ").append(child).append("\n");
//            }
//        }

        for (var entry : relationMap.entrySet()) {
            Pair<String,String> pair = entry.getKey();
            RelationType relationType = entry.getValue();

            switch(relationType) {
                case EXTENDS -> sb.append(pair.getFirst()).append(" <|-- ").append(pair.getSecond()).append("\n");
                case IMPLEMENTS -> sb.append(pair.getFirst()).append(" <|.. ").append(pair.getSecond()).append("\n");
                case ASSOCIATION -> sb.append(pair.getFirst()).append(" --> ").append(pair.getSecond()).append("\n");
                case DEPENDENCY ->  sb.append(pair.getFirst()).append(" ..> ").append(pair.getSecond()).append("\n");
            }
        }



        sb.append("\n@enduml");

        return sb.toString();
    }

    // Input: String fileLocation where the fill will be made, String content which will make up whats in the file
    // Output: file creation
    private static void createNewPumlFile(String fileLocation, String content){
        try{
            Path dir = Paths.get(fileLocation);

            Files.createDirectories(dir);

            Path file = dir.resolve("backend.puml");

            Files.writeString(file, content);
        }catch(IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static String getUmlDeclaration(String fqcn) {
        try {
            Class<?> clazz = Class.forName(fqcn);

            StringBuilder sb = new StringBuilder();

            if (clazz.isInterface()) {
                sb.append("interface ").append(clazz.getSimpleName()).append(" {\n");
            } else if (clazz.isEnum()) {
                sb.append("enum ").append(clazz.getSimpleName()).append(" {\n");
            } else {
                sb.append("class ").append(clazz.getSimpleName()).append(" {\n");
            }


            // Relations

            // Extends
            Class<?> superClass = clazz.getSuperclass();
            if (superClass != null && superClass != Object.class) {
                addRelation(superClass.getSimpleName(), clazz.getSimpleName(), EXTENDS);
                //extendMap.computeIfAbsent(superClass.getSimpleName(), k -> new HashSet<>()).add(clazz.getSimpleName());
                //sb.append(superClass.getSimpleName() + " <|-- " + clazz.getSimpleName()).append(" \n");
            }

            // Implements
            for (Class<?> interfaceClass : clazz.getInterfaces()) {
                addRelation(interfaceClass.getSimpleName(), clazz.getSimpleName(), IMPLEMENTS);
                //implementMap.computeIfAbsent(interfaceClass.getSimpleName(), k -> new HashSet<>()).add(clazz.getSimpleName());
                //sb.append(interfaceClass.getSimpleName() + " <|.. " + clazz.getSimpleName()).append(" \n");
            }

            // Association
            for (Field f : clazz.getDeclaredFields()) {
                Class<?> fieldType = f.getType();
                if (fieldType.getPackageName().startsWith("com.example")) {
                    addRelation(clazz.getSimpleName(), fieldType.getSimpleName(), ASSOCIATION);
                    //assoicationMap.computeIfAbsent(clazz.getSimpleName(), k -> new HashSet<>()).add(fieldType.getSimpleName());
                    //sb.append(clazz.getSimpleName() + " --> " + fieldType.getSimpleName());
                }
            }

            // Dependency
            for (Constructor<?> constructor : clazz.getDeclaredConstructors()) {
                for (Class<?> paramType : constructor.getParameterTypes()) {
                    if (paramType.getPackageName().startsWith("com.example")) {
                        addRelation(clazz.getSimpleName(), paramType.getSimpleName(), DEPENDENCY);
                        //dependencyMap.computeIfAbsent(clazz.getSimpleName(), k -> new HashSet<>()).add(paramType.getSimpleName());
                    }
                }
            }


            // Fields && Methods

            // Fields
            for (var field : clazz.getDeclaredFields()) {
                sb.append("  ").append(visibilitySymbol(field.getModifiers()))
                        .append(field.getName()).append("\n");
            }

            // Methods
            for (var method : clazz.getDeclaredMethods()) {
                if(method.isSynthetic() || method.getName().startsWith("lambda$")){
                    continue;
                }else{
                    sb.append("  ").append(visibilitySymbol(method.getModifiers()))
                            .append(method.getName()).append("()\n");
                }

            }

            sb.append("}\n");
            return sb.toString();
        } catch (ClassNotFoundException e) {
            return "// Could not load class " + fqcn + "\n";
        }
    }

    private static String visibilitySymbol(int mods) {
        if (java.lang.reflect.Modifier.isPublic(mods)) return "+";
        if (java.lang.reflect.Modifier.isPrivate(mods)) return "-";
        if (java.lang.reflect.Modifier.isProtected(mods)) return "#";
        return "~"; // package-private
    }

    static void addRelation(String from, String to, RelationType newType) {
        Pair<String,String> key = Pair.of(from, to);
        RelationType existing = relationMap.get(key);

        if (existing == null || newType.priority < existing.priority) {
            relationMap.put(key, newType); // overwrite only if stronger
        }
    }



    static void writeSvg() throws IOException {
        Path base = Paths.get("SENG3150-Project/Documentation/diagrams/src").toAbsolutePath().normalize();
        Path puml = base.resolve("backend.puml");
        Path svg  = base.resolve("backend.svg"); // or base.resolve("out/backend.svg")

        String src = Files.readString(puml);
        Files.createDirectories(svg.getParent());

        try (var os = Files.newOutputStream(svg)) {
            var reader = new SourceStringReader(src);
            reader.outputImage(os, new FileFormatOption(FileFormat.SVG));
        }
        System.out.println("Generated: " + svg);
    }


}

enum RelationType {
    EXTENDS(1),
    IMPLEMENTS(2),
    ASSOCIATION(3),
    DEPENDENCY(4);

    final int priority;
    RelationType(int p) { this.priority = p; }
}




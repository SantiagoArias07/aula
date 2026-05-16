package mx.aula.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class LocalStorageService implements StorageService {

    private final Path rootLocation;

    public LocalStorageService(@Value("${app.storage.local-path}") String storagePath) {
        this.rootLocation = Paths.get(storagePath);
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar el directorio de almacenamiento", e);
        }
    }

    @Override
    public String store(MultipartFile file, String subDirectory) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("No se puede almacenar un archivo vacío");
        }
        try {
            Path dir = rootLocation.resolve(subDirectory);
            Files.createDirectories(dir);
            String uniqueName = UUID.randomUUID() + "_" + sanitizeFileName(file.getOriginalFilename());
            Path destination = dir.resolve(uniqueName).normalize().toAbsolutePath();
            if (!destination.startsWith(rootLocation.toAbsolutePath())) {
                throw new RuntimeException("No se puede almacenar el archivo fuera del directorio de uploads");
            }
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return subDirectory + "/" + uniqueName;
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo", e);
        }
    }

    @Override
    public Resource load(String storedPath) {
        try {
            Path file = rootLocation.resolve(storedPath);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
            throw new RuntimeException("Archivo no encontrado: " + storedPath);
        } catch (MalformedURLException e) {
            throw new RuntimeException("Ruta de archivo inválida: " + storedPath, e);
        }
    }

    @Override
    public void delete(String storedPath) {
        try {
            Path file = rootLocation.resolve(storedPath);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            log.warn("No se pudo eliminar el archivo: {}", storedPath);
        }
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null) return "file";
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}

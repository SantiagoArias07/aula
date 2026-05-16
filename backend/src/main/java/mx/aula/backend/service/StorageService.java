package mx.aula.backend.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    /**
     * Stores the file and returns the relative stored path.
     */
    String store(MultipartFile file, String subDirectory);

    Resource load(String storedPath);

    void delete(String storedPath);
}

package mx.aula.backend.util;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class HashPrinterTest {
    @Test
    void printHash() {
        System.out.println("HASH=" + new BCryptPasswordEncoder().encode("Admin123"));
    }
}

package mx.aula.backend.service;

import mx.aula.backend.dto.auth.LoginRequest;
import mx.aula.backend.dto.auth.LoginResponse;
import mx.aula.backend.entity.Role;
import mx.aula.backend.entity.User;
import mx.aula.backend.repository.UserRepository;
import mx.aula.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock JwtTokenProvider jwtTokenProvider;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks AuthService authService;

    private User testUser;
    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(userId)
            .email("teacher@escuela.mx")
            .passwordHash("$2a$10$hashed")
            .firstName("María")
            .lastName("García")
            .role(Role.TEACHER)
            .active(true)
            .build();
    }

    @Test
    void login_withValidCredentials_returnsToken() {
        when(userRepository.findByEmail("teacher@escuela.mx")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "$2a$10$hashed")).thenReturn(true);
        when(jwtTokenProvider.generateToken(userId, "teacher@escuela.mx", Role.TEACHER))
            .thenReturn("jwt.token.here");

        LoginResponse response = authService.login(new LoginRequest("teacher@escuela.mx", "password123"));

        assertThat(response.token()).isEqualTo("jwt.token.here");
        assertThat(response.user().email()).isEqualTo("teacher@escuela.mx");
        assertThat(response.user().role()).isEqualTo(Role.TEACHER);
    }

    @Test
    void login_withUnknownEmail_throwsBadCredentials() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("nobody@escuela.mx", "pass")))
            .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void login_withWrongPassword_throwsBadCredentials() {
        when(userRepository.findByEmail("teacher@escuela.mx")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpass", "$2a$10$hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("teacher@escuela.mx", "wrongpass")))
            .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void login_withDeactivatedAccount_throwsBadCredentials() {
        testUser.setActive(false);
        when(userRepository.findByEmail("teacher@escuela.mx")).thenReturn(Optional.of(testUser));

        assertThatThrownBy(() -> authService.login(new LoginRequest("teacher@escuela.mx", "password123")))
            .isInstanceOf(BadCredentialsException.class)
            .hasMessageContaining("desactivada");
    }
}

package mx.aula.backend.service;

import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.auth.LoginRequest;
import mx.aula.backend.dto.auth.LoginResponse;
import mx.aula.backend.dto.user.UserDto;
import mx.aula.backend.entity.User;
import mx.aula.backend.repository.UserRepository;
import mx.aula.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));

        if (!user.isActive()) {
            throw new BadCredentialsException("Esta cuenta está desactivada");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new LoginResponse(token, UserDto.from(user));
    }
}

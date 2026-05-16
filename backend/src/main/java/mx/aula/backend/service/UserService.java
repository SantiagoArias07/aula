package mx.aula.backend.service;

import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.user.CreateUserRequest;
import mx.aula.backend.dto.user.UserDto;
import mx.aula.backend.entity.Role;
import mx.aula.backend.entity.User;
import mx.aula.backend.exception.ConflictException;
import mx.aula.backend.exception.ResourceNotFoundException;
import mx.aula.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Ya existe un usuario con el correo " + request.email());
        }
        User user = User.builder()
            .email(request.email())
            .passwordHash(passwordEncoder.encode(request.password()))
            .firstName(request.firstName())
            .lastName(request.lastName())
            .role(request.role())
            .build();
        return UserDto.from(userRepository.save(user));
    }

    public List<UserDto> listUsers(Role role) {
        List<User> users = (role != null)
            ? userRepository.findByRole(role)
            : userRepository.findAll();
        return users.stream().map(UserDto::from).toList();
    }

    public UserDto getUser(UUID id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return UserDto.from(user);
    }

    @Transactional
    public UserDto updateActiveStatus(UUID id, boolean active) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        user.setActive(active);
        return UserDto.from(userRepository.save(user));
    }
}

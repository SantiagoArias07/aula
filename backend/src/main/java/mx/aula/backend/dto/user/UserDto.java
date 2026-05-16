package mx.aula.backend.dto.user;

import mx.aula.backend.entity.Role;
import mx.aula.backend.entity.User;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UserDto(
    UUID id,
    String email,
    String firstName,
    String lastName,
    Role role,
    boolean active,
    OffsetDateTime createdAt
) {
    public static UserDto from(User user) {
        return new UserDto(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getRole(),
            user.isActive(),
            user.getCreatedAt()
        );
    }
}

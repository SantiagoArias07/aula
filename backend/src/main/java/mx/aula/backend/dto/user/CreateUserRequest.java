package mx.aula.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import mx.aula.backend.entity.Role;

public record CreateUserRequest(
    @NotBlank(message = "El correo electrónico es requerido")
    @Email(message = "Ingresa un correo electrónico válido")
    String email,

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    String password,

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    String firstName,

    @NotBlank(message = "El apellido es requerido")
    @Size(max = 100, message = "El apellido no puede superar 100 caracteres")
    String lastName,

    @NotNull(message = "El rol es requerido")
    Role role
) {}

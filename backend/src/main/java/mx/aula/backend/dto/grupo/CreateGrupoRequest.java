package mx.aula.backend.dto.grupo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateGrupoRequest(
    @NotBlank(message = "El nombre del grupo es requerido")
    @Size(max = 200, message = "El nombre no puede superar 200 caracteres")
    String name,

    @NotBlank(message = "La materia es requerida")
    @Size(max = 200, message = "La materia no puede superar 200 caracteres")
    String subject,

    @Size(max = 100, message = "El grado no puede superar 100 caracteres")
    String gradeLevel,

    String description,

    @NotNull(message = "El docente es requerido")
    UUID teacherId
) {}

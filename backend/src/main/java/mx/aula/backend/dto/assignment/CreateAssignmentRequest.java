package mx.aula.backend.dto.assignment;

import jakarta.validation.constraints.*;
import mx.aula.backend.entity.SubmissionType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record CreateAssignmentRequest(
    @NotBlank(message = "El título es requerido")
    @Size(max = 255, message = "El título no puede superar 255 caracteres")
    String title,

    String description,

    OffsetDateTime dueDate,

    @NotNull(message = "El puntaje máximo es requerido")
    @DecimalMin(value = "0", message = "El puntaje mínimo es 0")
    @DecimalMax(value = "1000", message = "El puntaje máximo es 1000")
    BigDecimal maxPoints,

    @NotNull(message = "El tipo de entrega es requerido")
    SubmissionType submissionType,

    boolean published
) {}

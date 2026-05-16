package mx.aula.backend.dto.assignment;

import mx.aula.backend.entity.Assignment;
import mx.aula.backend.entity.SubmissionStatus;
import mx.aula.backend.entity.SubmissionType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record AssignmentDto(
    UUID id,
    UUID grupoId,
    String grupoName,
    String title,
    String description,
    OffsetDateTime dueDate,
    BigDecimal maxPoints,
    SubmissionType submissionType,
    boolean published,
    OffsetDateTime createdAt,
    SubmissionStatus submissionStatus
) {
    public static AssignmentDto from(Assignment a, SubmissionStatus submissionStatus) {
        return new AssignmentDto(
            a.getId(),
            a.getGrupo().getId(),
            a.getGrupo().getName(),
            a.getTitle(),
            a.getDescription(),
            a.getDueDate(),
            a.getMaxPoints(),
            a.getSubmissionType(),
            a.isPublished(),
            a.getCreatedAt(),
            submissionStatus
        );
    }

    public static AssignmentDto from(Assignment a) {
        return from(a, null);
    }
}

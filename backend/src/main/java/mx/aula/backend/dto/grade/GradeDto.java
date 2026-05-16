package mx.aula.backend.dto.grade;

import mx.aula.backend.entity.Grade;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record GradeDto(
    UUID id,
    UUID submissionId,
    BigDecimal score,
    BigDecimal maxPoints,
    String feedback,
    String graderName,
    OffsetDateTime gradedAt,
    OffsetDateTime updatedAt
) {
    public static GradeDto from(Grade grade) {
        return new GradeDto(
            grade.getId(),
            grade.getSubmission().getId(),
            grade.getScore(),
            grade.getAssignment().getMaxPoints(),
            grade.getFeedback(),
            grade.getGrader().getFirstName() + " " + grade.getGrader().getLastName(),
            grade.getGradedAt(),
            grade.getUpdatedAt()
        );
    }
}

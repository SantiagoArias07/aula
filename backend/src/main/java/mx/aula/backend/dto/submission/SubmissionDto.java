package mx.aula.backend.dto.submission;

import mx.aula.backend.dto.grade.GradeDto;
import mx.aula.backend.dto.user.UserDto;
import mx.aula.backend.entity.Submission;
import mx.aula.backend.entity.SubmissionStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SubmissionDto(
    UUID id,
    UUID assignmentId,
    String assignmentTitle,
    UserDto student,
    String textBody,
    String fileName,
    Long fileSizeBytes,
    OffsetDateTime submittedAt,
    SubmissionStatus status,
    GradeDto grade
) {
    public static SubmissionDto from(Submission s, GradeDto grade) {
        return new SubmissionDto(
            s.getId(),
            s.getAssignment().getId(),
            s.getAssignment().getTitle(),
            UserDto.from(s.getStudent()),
            s.getTextBody(),
            s.getFileName(),
            s.getFileSizeBytes(),
            s.getSubmittedAt(),
            s.getStatus(),
            grade
        );
    }

    public static SubmissionDto from(Submission s) {
        return from(s, null);
    }
}

package mx.aula.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.submission.CreateSubmissionRequest;
import mx.aula.backend.dto.submission.SubmissionDto;
import mx.aula.backend.security.UserPrincipal;
import mx.aula.backend.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Entregas")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/api/assignments/{assignmentId}/submit")
    @Operation(summary = "Entregar tarea (alumno)")
    public ResponseEntity<SubmissionDto> submit(
        @PathVariable UUID assignmentId,
        @RequestBody(required = false) CreateSubmissionRequest req,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        CreateSubmissionRequest body = req != null ? req : new CreateSubmissionRequest(null);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(submissionService.submit(assignmentId, body, user.getId()));
    }

    @PostMapping(value = "/api/assignments/{assignmentId}/submit/file",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Adjuntar archivo a una entrega (alumno)")
    public ResponseEntity<SubmissionDto> attachFile(
        @PathVariable UUID assignmentId,
        @RequestPart("file") MultipartFile file,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(submissionService.attachFile(assignmentId, file, user.getId()));
    }

    @GetMapping("/api/assignments/{assignmentId}/submissions")
    @Operation(summary = "Ver todas las entregas de una tarea (docente)")
    public ResponseEntity<List<SubmissionDto>> listForAssignment(
        @PathVariable UUID assignmentId,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(submissionService.listForAssignment(assignmentId, user.getId()));
    }

    @GetMapping("/api/assignments/{assignmentId}/my-submission")
    @Operation(summary = "Ver mi entrega (alumno)")
    public ResponseEntity<SubmissionDto> getMySubmission(
        @PathVariable UUID assignmentId,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(submissionService.getMySubmission(assignmentId, user.getId()));
    }

    @GetMapping("/api/submissions/{submissionId}")
    @Operation(summary = "Detalle de una entrega (docente o alumno dueño)")
    public ResponseEntity<SubmissionDto> getOne(
        @PathVariable UUID submissionId,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(submissionService.getOne(submissionId, user.getId(), user.getRole()));
    }
}

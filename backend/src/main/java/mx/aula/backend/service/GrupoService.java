package mx.aula.backend.service;

import lombok.RequiredArgsConstructor;
import mx.aula.backend.dto.grupo.CreateGrupoRequest;
import mx.aula.backend.dto.grupo.GrupoDto;
import mx.aula.backend.dto.user.UserDto;
import mx.aula.backend.entity.Grupo;
import mx.aula.backend.entity.Membership;
import mx.aula.backend.entity.Role;
import mx.aula.backend.entity.User;
import mx.aula.backend.exception.ForbiddenException;
import mx.aula.backend.exception.ResourceNotFoundException;
import mx.aula.backend.repository.GrupoRepository;
import mx.aula.backend.repository.MembershipRepository;
import mx.aula.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GrupoService {

    private final GrupoRepository grupoRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;

    @Transactional
    public GrupoDto createGrupo(CreateGrupoRequest request) {
        User teacher = userRepository.findById(request.teacherId())
            .filter(u -> u.getRole() == Role.TEACHER)
            .orElseThrow(() -> new ResourceNotFoundException("Docente no encontrado"));

        Grupo grupo = Grupo.builder()
            .name(request.name())
            .subject(request.subject())
            .gradeLevel(request.gradeLevel())
            .description(request.description())
            .teacher(teacher)
            .build();

        Grupo saved = grupoRepository.save(grupo);
        return GrupoDto.from(saved, 0);
    }

    public List<GrupoDto> listGrupos(UUID userId, Role role) {
        List<Grupo> grupos = switch (role) {
            case TEACHER -> grupoRepository.findByTeacherIdAndActiveTrue(userId);
            case STUDENT -> grupoRepository.findByStudentId(userId);
            case ADMIN -> grupoRepository.findAll();
        };
        return grupos.stream()
            .map(g -> GrupoDto.from(g, membershipRepository.findByGrupoIdAndActiveTrue(g.getId()).size()))
            .toList();
    }

    public List<GrupoDto> listAllGrupos() {
        return grupoRepository.findAll().stream()
            .map(g -> GrupoDto.from(g, membershipRepository.findByGrupoIdAndActiveTrue(g.getId()).size()))
            .toList();
    }

    public GrupoDto getGrupo(UUID id, UUID userId, Role role) {
        Grupo grupo = grupoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        if (role == Role.TEACHER && !grupo.getTeacher().getId().equals(userId)) {
            throw new ForbiddenException("No tienes acceso a este grupo");
        }
        if (role == Role.STUDENT && !membershipRepository.existsByStudentIdAndGrupoIdAndActiveTrue(userId, id)) {
            throw new ForbiddenException("No estás inscrito en este grupo");
        }

        int studentCount = membershipRepository.findByGrupoIdAndActiveTrue(id).size();
        return GrupoDto.from(grupo, studentCount);
    }

    @Transactional
    public void enrollStudents(UUID grupoId, List<UUID> studentIds, UUID requestedByAdmin) {
        Grupo grupo = grupoRepository.findById(grupoId)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        for (UUID studentId : studentIds) {
            User student = userRepository.findById(studentId)
                .filter(u -> u.getRole() == Role.STUDENT)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado: " + studentId));

            membershipRepository.findByStudentIdAndGrupoId(studentId, grupoId)
                .ifPresentOrElse(
                    m -> m.setActive(true),
                    () -> membershipRepository.save(
                        Membership.builder().student(student).grupo(grupo).build()
                    )
                );
        }
    }

    public List<UserDto> getStudentsInGrupo(UUID grupoId, UUID teacherId) {
        Grupo grupo = grupoRepository.findById(grupoId)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));

        if (!grupo.getTeacher().getId().equals(teacherId)) {
            throw new ForbiddenException("No tienes acceso a este grupo");
        }

        return membershipRepository.findByGrupoIdAndActiveTrue(grupoId).stream()
            .map(m -> UserDto.from(m.getStudent()))
            .toList();
    }

    public void assertTeacherOwnsGrupo(UUID grupoId, UUID teacherId) {
        Grupo grupo = grupoRepository.findById(grupoId)
            .orElseThrow(() -> new ResourceNotFoundException("Grupo no encontrado"));
        if (!grupo.getTeacher().getId().equals(teacherId)) {
            throw new ForbiddenException("No eres el docente de este grupo");
        }
    }

    public void assertStudentInGrupo(UUID grupoId, UUID studentId) {
        if (!membershipRepository.existsByStudentIdAndGrupoIdAndActiveTrue(studentId, grupoId)) {
            throw new ForbiddenException("No estás inscrito en este grupo");
        }
    }
}

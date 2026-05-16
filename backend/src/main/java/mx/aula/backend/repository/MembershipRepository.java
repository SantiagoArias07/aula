package mx.aula.backend.repository;

import mx.aula.backend.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MembershipRepository extends JpaRepository<Membership, UUID> {
    List<Membership> findByGrupoIdAndActiveTrue(UUID grupoId);
    List<Membership> findByStudentIdAndActiveTrue(UUID studentId);
    boolean existsByStudentIdAndGrupoIdAndActiveTrue(UUID studentId, UUID grupoId);
    Optional<Membership> findByStudentIdAndGrupoId(UUID studentId, UUID grupoId);
}

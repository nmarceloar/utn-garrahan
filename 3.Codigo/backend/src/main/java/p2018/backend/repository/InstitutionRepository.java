package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import p2018.backend.entities.Institution;

public interface InstitutionRepository extends JpaRepository<Institution, Long> {

}

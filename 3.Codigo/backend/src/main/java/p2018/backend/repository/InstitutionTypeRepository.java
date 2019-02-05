package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import p2018.backend.entities.InstitutionType;

public interface InstitutionTypeRepository extends JpaRepository<InstitutionType, String> {

}

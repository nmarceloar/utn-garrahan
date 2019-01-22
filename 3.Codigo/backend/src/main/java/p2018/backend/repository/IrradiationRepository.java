package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import p2018.backend.entities.Irradiation;

public interface IrradiationRepository extends JpaRepository<Irradiation, Long> {

}

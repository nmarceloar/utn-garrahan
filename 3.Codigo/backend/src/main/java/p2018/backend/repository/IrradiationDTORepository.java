package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import p2018.backend.entities.IrradiationDTO;

public interface IrradiationDTORepository extends JpaRepository<IrradiationDTO, Long> {

}

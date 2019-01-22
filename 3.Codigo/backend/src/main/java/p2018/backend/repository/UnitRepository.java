package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import p2018.backend.entities.Unit;

public interface UnitRepository extends JpaRepository<Unit, Long> {

}

package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import p2018.backend.entities.Unit;

public interface UnitRepository extends JpaRepository<Unit, Long> {
	
	@Query("select count(u) from Unit u where u.orderId = :orderId")
	Long findUnitsCountByOrderId(@Param("orderId") Long orderId);
	
	@Query("select count(u) from Unit u where u.orderId = :orderId and irradiated = :irradiated")
	Long findPendingUnits(@Param("orderId") Long orderId, @Param("irradiated") Boolean irradiated);
}

package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import p2018.backend.entities.OrderTransition;

public interface OrderTransitionRepository extends JpaRepository<OrderTransition, Long> {
	
	
}

package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import p2018.backend.entities.OrderStatus;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, String> {

}

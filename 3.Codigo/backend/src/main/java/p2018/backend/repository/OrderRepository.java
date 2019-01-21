package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import p2018.backend.entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}

package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import p2018.backend.entities.Priority;

public interface PriorityRepository extends JpaRepository<Priority, Long> {

}

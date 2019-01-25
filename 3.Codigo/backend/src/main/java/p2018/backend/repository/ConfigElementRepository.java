package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import p2018.backend.entities.ConfigElement;

public interface ConfigElementRepository extends JpaRepository<ConfigElement, String> {

}

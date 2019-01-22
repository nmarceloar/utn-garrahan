package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import p2018.backend.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{

}

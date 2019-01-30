package p2018.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import p2018.backend.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
	
	@Query("select u from User u where u.username = :username or u.password = :password")
	User findByUserNameAndPass(@Param("username") String username,
	                                 @Param("password") String password);
	
	User findByUsername(String username);
	
}

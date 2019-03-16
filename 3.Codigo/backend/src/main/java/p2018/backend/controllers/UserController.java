package p2018.backend.controllers;

import static org.springframework.http.ResponseEntity.ok;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import p2018.backend.entities.User;
import p2018.backend.repository.OrderRepository;
import p2018.backend.repository.UserRepository;
import p2018.backend.utils.AuthenticationRequest;
import p2018.backend.utils.Constants;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private AuthenticationManager authenticationManager;

	@GetMapping("/xusers")
	public List<User> getUsers() {
		return userRepository.findAll();
	}

	@GetMapping("/xusers/{id}")
	public User getUser(@PathVariable Long id) {
		return userRepository.getOne(id);
	}

	@DeleteMapping("/xuser/{id}")
	public boolean deleteUser(@PathVariable Long id) {
		userRepository.deleteById(id);
		return true;
	}

	@PostMapping("/xusers")
	public User createUser(@RequestBody User user) {
		return userRepository.save(user);
	}

	@PutMapping("/xusers")
	public User updateUser(@RequestBody User user) {
		return userRepository.save(user);
	}

	@GetMapping("/xusers/{id}/orders/count")
	public Integer getUserOrdersCount(@PathVariable Long id) {
		return orderRepository.findOrderCountByUserId(id)
				.intValue();
	}

	@PutMapping("/xusers/{id}/disable")
	public void disableUser(@PathVariable Long id) {
		User user = userRepository.getOne(id);
		user.setActive(false);
		userRepository.save(user);
	}

	@PutMapping("/xusers/{id}/enable")
	public void enableUser(@PathVariable Long id) {
		User user = userRepository.getOne(id);
		user.setActive(true);
		userRepository.save(user);
	}

	@SuppressWarnings("rawtypes")
	@PostMapping("/xusers/login")
	public ResponseEntity login(@RequestBody AuthenticationRequest data) {

		try {
			String username = data.getUsername();
			User user = userRepository.findByUsername(username);
			Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,
					data.getPassword()));

			String token = Jwts.builder()
					.setIssuedAt(new Date())
					.setIssuer(Constants.ISSUER_INFO)
					.setSubject(username)
					.setExpiration(new Date(System.currentTimeMillis() + Constants.TOKEN_EXPIRATION_TIME))
					.signWith(SignatureAlgorithm.HS512, Constants.SUPER_SECRET_KEY)
					.compact();

			Map<Object, Object> model = new HashMap<>();
			model.put("token", token);
			model.put("user", user);
			return ok(model);

		} catch (AuthenticationException e) {
			throw new BadCredentialsException("Invalid username/password supplied");
		}
	}

	@PostMapping("/xusers/verifyCredentials")
	public User verifyCredentials(@RequestBody AuthenticationRequest data) {

		String encryptPassword = BCrypt.hashpw(data.getPassword(), BCrypt.gensalt());
		return userRepository.findByUserNameAndPass(data.getUsername(), encryptPassword);

	}

}

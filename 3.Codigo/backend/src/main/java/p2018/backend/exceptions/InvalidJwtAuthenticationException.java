package p2018.backend.exceptions;

import org.springframework.security.core.AuthenticationException;

public class InvalidJwtAuthenticationException extends AuthenticationException {
	
	private static final long serialVersionUID = -5819409805746982593L;

	public InvalidJwtAuthenticationException(String e) {
        super(e);
    }
}

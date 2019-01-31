package p2018.backend.exceptions;

public class GarrahanAPIException extends RuntimeException {

	private static final long serialVersionUID = -8355866078151684270L;

	public GarrahanAPIException(String message) {
		super(message);
	}
	
	public GarrahanAPIException(String message, Exception e) {
		super(message);
	}

}

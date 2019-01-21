package p2018.backend.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class UnitType {

	@Id
	@GeneratedValue
	private Long id;

	private String code;
	private String name;

	private boolean enabled;

	public UnitType(String code, String description) {
		this.code = code;
		this.name = description;
		this.enabled = true;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}


	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}

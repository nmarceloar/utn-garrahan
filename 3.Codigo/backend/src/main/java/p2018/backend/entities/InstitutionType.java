package p2018.backend.entities;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class InstitutionType implements Serializable {


	private static final long serialVersionUID = 7604643309442132432L;
	
	@Id
	private String name;
	private String description;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public InstitutionType(String name, String description) {
		super();
		this.name = name;
		this.description = description;
	}
	public InstitutionType() {
		super();
	}
	@Override
	public String toString() {
		return "InstitutionType [name=" + name + ", description=" + description + "]";
	}

}

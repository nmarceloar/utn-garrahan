package p2018.backend.entities;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Entity
public class Institution extends AuditableEntity implements Serializable{
	
	
	private static final long serialVersionUID = 5228559901415652071L;
	
	private String name;
	private String cuit;
	private String address;
	private String email;
	
	@Enumerated(EnumType.STRING)
	private InstitutionType type;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCuit() {
		return cuit;
	}

	public void setCuit(String cuit) {
		this.cuit = cuit;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	
	public Institution() {
		
	}

	public Institution(String name, String cuit, String address, String email, InstitutionType type) {
		this.name = name;
		this.cuit = cuit;
		this.address = address;
		this.email = email;
		this.type = type;
	}
	

	@Override
	public String toString() {
		return "Institution [id=" + this.getId() + ", name=" + name + ", cuit=" + cuit + ", address=" + address + ", email="
				+ email + ", institutionType=" + type + "]";
	}
	

	public InstitutionType getType() {
		return type;
	}

	public void setType(InstitutionType type) {
		this.type = type;
	}

}

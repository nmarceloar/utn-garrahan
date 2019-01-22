package p2018.backend.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "OrderPriority")
public class Priority implements Serializable {


	private static final long serialVersionUID = 6399851982226223945L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	private String name;
	private String description;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
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
	public Priority(Long id, String name, String description) {
		this.id = id;
		this.name = name;
		this.description = description;
	}
	public Priority() {
	
	}
	@Override
	public String toString() {
		return "Priority [id=" + id + ", name=" + name + ", description=" + description + "]";
	}
	
	
	
	
	
	
}
package p2018.backend.entities;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
/**
 * 
 * This abstract class defines the audit fields in the table.
 * Every time an entity is persisted this class provide the current date data
 * in the @onCrate method
 * 
 * @author gmolina
 * 
 */
@MappedSuperclass
public abstract class AuditableEntity implements Serializable{


	private static final long serialVersionUID = -3556767176581403594L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	@Column(name="creationDate")
	private Date creationDate;
	
	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	@PrePersist
	protected void onCreate() {
		this.setCreationDate(new Timestamp((new Date()).getTime()));
	}
}

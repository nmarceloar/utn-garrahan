package p2018.backend.orders;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class UnitType {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String code;
	private String description;

	private boolean enabled;

	public UnitType(String code, String description) {
		this.code = code;
		this.description = description;
		this.enabled = true;
	}

}

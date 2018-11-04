package p2018.backend.orders;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import p2018.backend.exceptions.DomainException;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String code;
	private String carrier;

	@OneToMany(cascade = {}, fetch = FetchType.EAGER, orphanRemoval = true)
	@JoinColumn(name = "order_id", referencedColumnName = "id")
	@Singular
	private Set<Unit> units = new HashSet<>();

	private Status status;

	private Priority priority;

	public int unitCount() {
		return this.units.size();
	}

	public void addUnit(Unit unit) {

		if (!this.units.add(unit))
			throw new DomainException("No se permite más de una unidad con mismo tipo y código");

	}

}

package p2018.backend.entities;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "Unit")
public class UnitDTO extends AuditableEntity implements Serializable {


	private static final long serialVersionUID = -3595153135203384674L;
	
	private String code;
	private Long unitTypeId;
	private Long orderId;
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public Long getUnitTypeId() {
		return unitTypeId;
	}
	public void setUnitTypeId(Long unitTypeId) {
		this.unitTypeId = unitTypeId;
	}
	public Long getOrderId() {
		return orderId;
	}
	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}
	public UnitDTO(String code, Long unitTypeId, Long orderId) {
		this.code = code;
		this.unitTypeId = unitTypeId;
		this.orderId = orderId;
	}
	public UnitDTO() {

	}
	@Override
	public String toString() {
		return "UnitDTO [code=" + code + ", unitTypeId=" + unitTypeId + "]";
	}
}

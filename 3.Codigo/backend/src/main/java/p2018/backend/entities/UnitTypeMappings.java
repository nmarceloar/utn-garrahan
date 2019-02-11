package p2018.backend.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "UnitTypeMapping")
public class UnitTypeMappings implements Serializable {


	private static final long serialVersionUID = 4085999380087848318L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	private Integer count;
	private Long orderId;
	
	@Column(name = "unitTypeId")
	private Long unitTypeId;
	
	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unitTypeId", insertable = false, updatable = false)
	private UnitType unitType;
	
	@ManyToOne
    @JoinColumn(name="orderId", insertable = false, updatable = false)
	@JsonIgnore
	private OrderInfo orderInfo;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
	public Long getOrderId() {
		return orderId;
	}
	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}
	public UnitType getUnitType() {
		return unitType;
	}
	public Long getUnitTypeId() {
		return unitTypeId;
	}
	public void setUnitTypeId(Long unitTypeId) {
		this.unitTypeId = unitTypeId;
	}
	public OrderInfo getOrderInfo() {
		return orderInfo;
	}
	public void setOrderInfo(OrderInfo orderInfo) {
		this.orderInfo = orderInfo;
	}
	public void setUnitType(UnitType unitType) {
		this.unitType = unitType;
	}
	public UnitTypeMappings(Long id, Integer count, Long orderId, UnitType unitType) {
		
		this.id = id;
		this.count = count;
		this.orderId = orderId;
		this.unitType = unitType;
	}
	
	public UnitTypeMappings() {
		
	}
	
	@Override
	public String toString() {
		return "UnitTypeMappings [id=" + id + ", count=" + count + ", orderId=" + orderId + ", unitType=" + unitType
				+ "]";
	}
	


}

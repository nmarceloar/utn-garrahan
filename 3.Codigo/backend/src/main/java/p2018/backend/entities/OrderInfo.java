package p2018.backend.entities;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.Version;


@Entity
public class OrderInfo extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = -1822331454767706045L;

	private String code;
	private String carrier;
	private Date acceptedOn;
	private Date completionDate;
	private Date lastModified;
	private Integer unitCount;
	
	@Version
	private Integer version;
	
	@Column(name = "institutionId", insertable = false, updatable = false)
	private Long institutionId;
	
	@Column(name = "ownerId", insertable = false, updatable = false)
	private Long ownerId;
	
	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "statusId")
	private OrderStatus status;
	
	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "priorityId")
	private Priority priority;
	
	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institutionId")
	private Institution institution;
	
	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operatorId")
	private User orderAcceptor;
	
	@OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ownerId")
	private User owner;
	
	@OneToMany(mappedBy = "orderInfo")
	private Set<Unit> units = new HashSet<>();
	
	@OneToMany(mappedBy = "orderInfo")
	private Set<ConciliationComment> conciliationComments;
	
	@OneToMany(mappedBy = "orderInfo")
	private Set<Irradiation> irradiations;
	
	@OneToMany(mappedBy = "orderInfo")
	private Set<UnitTypeMappings> unitTypeMappings;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCarrier() {
		return carrier;
	}

	public void setCarrier(String carrier) {
		this.carrier = carrier;
	}

	public Date getAcceptedOn() {
		return acceptedOn;
	}

	public void setAcceptedOn(Date aceptedOn) {
		this.acceptedOn = aceptedOn;
	}

	public Date getCompletionDate() {
		return completionDate;
	}

	public void setCompletionDate(Date completionDate) {
		this.completionDate = completionDate;
	}

	public Priority getPriority() {
		return priority;
	}

	public void setPriority(Priority priority) {
		this.priority = priority;
	}

	public Institution getInstitution() {
		return institution;
	}

	public void setInstitution(Institution institution) {
		this.institution = institution;
	}

	public User getOrderAcceptor() {
		return orderAcceptor;
	}

	public void setOrderAcceptor(User orderAcceptor) {
		this.orderAcceptor = orderAcceptor;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}
	
	public Integer getUnitCount() {
		return unitCount;
	}

	public void setUnitCount(Integer unitCount) {
		this.unitCount = unitCount;
	}
	
	public Long getInstitutionId() {
		return institutionId;
	}

	public void setInstitutionId(Long institutionId) {
		this.institutionId = institutionId;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}
	
	public Set<Unit> getUnits() {
		return units;
	}

	public void setUnits(Set<Unit> units) {
		this.units = units;
	}
	
	
	public Set<ConciliationComment> getConciliationComments() {
		return conciliationComments;
	}

	public void setConciliationComments(Set<ConciliationComment> conciliationComments) {
		this.conciliationComments = conciliationComments;
	}
	
	public Set<Irradiation> getIrradiations() {
		return irradiations;
	}

	public void setIrradiations(Set<Irradiation> irradiations) {
		this.irradiations = irradiations;
	}
	
	public Date getLastModified() {
		return lastModified;
	}

	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}
	
	public Set<UnitTypeMappings> getUnitTypeMappings() {
		return unitTypeMappings;
	}

	public void setUnitTypeMappings(Set<UnitTypeMappings> unitTypeMappings) {
		this.unitTypeMappings = unitTypeMappings;
	}

	public OrderInfo(String code, String carrier, Date acceptedOn, Date completionDate, Integer unitCount,
			OrderStatus status, Priority priority, Institution institution, User orderAcceptor, User owner) {
		this.code = code;
		this.carrier = carrier;
		this.acceptedOn = acceptedOn;
		this.completionDate = completionDate;
		this.unitCount = unitCount;
		this.status = status;
		this.priority = priority;
		this.institution = institution;
		this.orderAcceptor = orderAcceptor;
		this.owner = owner;
	}

	public OrderInfo() {

	}

	@Override
	public String toString() {
		return "Order [code=" + code + ", carrier=" + carrier + ", acceptedOn=" + acceptedOn + ", completionDate="
				+ completionDate + ", status=" + status + ", priority=" + priority + "]";
	}
	
	@Override
	@PrePersist
	protected void onCreate() {
		this.setCreationDate(new Timestamp((new Date()).getTime()));
	}

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}

}

package p2018.backend.controllers;

import static org.springframework.http.ResponseEntity.ok;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import p2018.backend.entities.Institution;
import p2018.backend.entities.InstitutionType;
import p2018.backend.entities.OrderInfo;
import p2018.backend.entities.OrderInfoDTO;
import p2018.backend.entities.OrderTransition;
import p2018.backend.entities.Unit;
import p2018.backend.entities.UnitType;
import p2018.backend.entities.UnitTypeMappings;
import p2018.backend.exceptions.GarrahanAPIException;
import p2018.backend.repository.InstitutionRepository;
import p2018.backend.repository.InstitutionTypeRepository;
import p2018.backend.repository.OrderInfoDTORepository;
import p2018.backend.repository.OrderRepository;
import p2018.backend.repository.OrderTransitionRepository;
import p2018.backend.repository.UnitRepository;
import p2018.backend.repository.UnitTypeMappingsRepository;
import p2018.backend.repository.UnitTypeRepository;
import p2018.backend.utils.RequestFilterParser;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="http://localhost:4200", allowedHeaders="*")
public class OrderController {
	
	@Autowired
	private OrderRepository orderrepository;
	
	@Autowired
	private OrderInfoDTORepository orderInfoDTORepository;
	
	@Autowired
	private OrderTransitionRepository orderTransitionRepository;
	
	@Autowired
	private UnitRepository unitRepository;
	
	@Autowired
	private RequestFilterParser requestFilterParser;
	
	@Autowired
	private InstitutionTypeRepository institutionTypeRepository;
	
	@Autowired
	private InstitutionRepository  institutionRepository;
	
	@Autowired
	private UnitTypeRepository unitTypeRepository;
	
	@Autowired
	private UnitTypeMappingsRepository unitTypeMappingsRepository;
	
	@GetMapping("/orders")
	public List<OrderInfo> getOrders(){
		return orderrepository.findAll();
	}
	
	@SuppressWarnings("rawtypes")
	@GetMapping("/orders/page")
	public ResponseEntity getPagedOrders(@RequestParam("filter") String query, Pageable pageable){
		
		Pageable pageRequest = requestFilterParser.createPageRequest(query);
		
		Specification orderSpec = requestFilterParser.crateOrderSpecification(query);
        
		Page<OrderInfo> orders =  orderrepository.findAll(orderSpec, pageRequest);
		Long listCount = orders.getTotalElements();
		List<OrderInfo> orderPage = orders.getContent();
		
		Map<Object, Object> model = new HashMap<>();
        model.put("count", listCount);
        model.put("items", orderPage);
        return ok(model);
        
	}
	
	@GetMapping("/orders/{id}")
	public OrderInfo getOrder(@PathVariable Long id){
		return orderrepository.getOne(id);
	}
	
	@DeleteMapping("/orders/{id}")
	public boolean deleteOrder(@PathVariable Long id){
		orderrepository.deleteById(id);
		return true;
	}
	
	@PostMapping("/orders")
	public OrderInfo createOrder(@RequestBody OrderInfoDTO order){
		
		order.setUnitCount(order.getUnits().size());
		OrderInfoDTO orderDTO =  orderInfoDTORepository.save(order);
		
		List<UnitType> unitTypes = unitTypeRepository.findAll();
		for (Iterator<UnitType> iterator = unitTypes.iterator(); iterator.hasNext();) {
			
			UnitType unitType = (UnitType) iterator.next();
			UnitTypeMappings unitTypeMaping = new UnitTypeMappings();
			unitTypeMaping.setOrderId(orderDTO.getId());
			unitTypeMaping.setUnitTypeId(unitType.getId());
			
			int occurrences = Collections.frequency(order.getUnits(), "bat");
			unitTypeMaping.setCount(occurrences);
			
		}
		
		return orderrepository.getOne(orderDTO.getId());
	}
	
	@PutMapping("/orders")
	public OrderInfo updateUnit(@RequestBody OrderInfo order){
		return orderrepository.save(order);
	}
	
	@GetMapping("/orders/{id}/units/count")
	public  Integer getOrderUnitsCount(@PathVariable Long orderId){
		return unitRepository.findUnitsCountByOrderId(orderId).intValue();
	}
	
	@PatchMapping("/orders/{id}")
	public ResponseEntity<OrderInfo> partialUpdateName(@RequestBody OrderTransition partialUpdate, @PathVariable("id") String id) {
	    
		partialUpdate.setId(new Long(id));
		orderTransitionRepository.save(partialUpdate);
		OrderInfo order = orderrepository.getOne(new Long(id));
		Set<Unit> units = order.getUnits();
		
		for (Iterator<Unit> iterator = units.iterator(); iterator.hasNext();) {
			
			Unit unit = (Unit) iterator.next();
			Long typeId = unit.getType().getId();
			
			UnitTypeMappings unitTypeMapping = new UnitTypeMappings();
			unitTypeMapping.setCount(1);
			unitTypeMapping.setUnitTypeId(typeId);
			unitTypeMapping.setOrderId(new Long(id));
			
			unitTypeMappingsRepository.save(unitTypeMapping);
			
		}
		
	    return ResponseEntity.ok(order);
	}
	
	@GetMapping("/orders/monthlyReport")
	public ResponseEntity<?> getOrderMomthlyReport(@RequestParam("date") String date){
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.000'Z'");
		Date startDate;
		Calendar cal = Calendar.getInstance();
		
		List<OrderInfo> orders = new ArrayList<OrderInfo>();
		List<InstitutionType> institutionTypes = new ArrayList<InstitutionType>();
		List<Institution> institutions = new ArrayList<Institution>();
		List<UnitType> unitTypes = new ArrayList<UnitType>();
		
		try {
			startDate = dateFormat.parse(date);
			cal.setTime(startDate);
			cal.add(Calendar.MONTH, 1);
			Date endDate = cal.getTime();
		
			orders = orderrepository.getMonthlyReport(startDate, endDate);
			institutionTypes = institutionTypeRepository.findAll();
			institutions = institutionRepository.findAll();
			unitTypes = unitTypeRepository.findAll();
			
		} catch (ParseException e) {
			e.printStackTrace();
			throw new GarrahanAPIException("Error parsing filter parameter from request", e);
		}
		
		Map<Object, Object> model = new HashMap<>();
		model.put("institutionTypes", institutionTypes);
		model.put("institutions", institutions);
		model.put("orders", orders);
		model.put("startOfMonth", date);
		model.put("unitTypes", unitTypes);

        return ok(model);
	}
	
	@GetMapping("/orders/dailyReport")
	public ResponseEntity<?> getOrderDaylyReport(@RequestParam("date") String date){
		
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.000'Z'");
		Date selectedDate;
		
		List<OrderInfo> orders = new ArrayList<OrderInfo>();
		List<InstitutionType> institutionTypes = new ArrayList<InstitutionType>();
		
		try {
			selectedDate = dateFormat.parse(date);
			Date endDate = new Date(selectedDate.getTime() - 2);
		
			orders = orderrepository.getMonthlyReport(selectedDate, endDate);
			institutionTypes = institutionTypeRepository.findAll();
			
		} catch (ParseException e) {
			e.printStackTrace();
			throw new GarrahanAPIException("Error parsing filter parameter from request", e);
		}
		
		Map<Object, Object> model = new HashMap<>();
		
		model.put("date", selectedDate);
		model.put("institutionTypes", institutionTypes);
		model.put("orders", orders);
		model.put("total", orders.size());
		
		return ok(model);
	}
	
}

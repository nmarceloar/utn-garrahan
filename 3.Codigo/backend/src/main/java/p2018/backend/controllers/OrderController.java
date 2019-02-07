package p2018.backend.controllers;

import static org.springframework.http.ResponseEntity.ok;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import p2018.backend.entities.OrderInfo;
import p2018.backend.entities.OrderInfoDTO;
import p2018.backend.entities.OrderTransition;
import p2018.backend.repository.OrderInfoDTORepository;
import p2018.backend.repository.OrderRepository;
import p2018.backend.repository.OrderTransitionRepository;
import p2018.backend.repository.UnitRepository;
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
	public OrderInfo createUnit(@RequestBody OrderInfoDTO order){
		order.setUnitCount(order.getUnits().size());
		OrderInfoDTO orderDTO =  orderInfoDTORepository.save(order);
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
		
	    return ResponseEntity.ok(order);
	}
	
	@GetMapping("/orders/monthlyReport")
	public ResponseEntity<?> getOrderMomthlyReport(@RequestParam("date") String date){
		
		Date reportDate = new Date(date);
		List<OrderInfo> orders = orderrepository.getMonthlyReport(reportDate);
		
		Map<Object, Object> model = new HashMap<>();

        return ok(model);
	}
	
}

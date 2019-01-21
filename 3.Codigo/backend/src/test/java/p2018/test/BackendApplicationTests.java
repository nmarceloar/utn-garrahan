package p2018.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import p2018.backend.repository.InstitutionRepository;
import p2018.backend.repository.OrderRepository;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BackendApplicationTests {

	@Autowired
	private OrderRepository orderRepository;
	
	@Autowired
	private InstitutionRepository institutionRepository;

	@Test
	public void contextLoads() {
	}

	@Test
	public void test1() {

		//UnitType type = new UnitType("AFR", "Aféresis");

		//Order order = new Order();
		//order.setStatus(Status.PENDING);
		//order.setCarrier("asdasd");
		//order.setCode("asdasdasdsadas");
		//order.setPriority(Priority.NORMAL);
		//order.addUnit(new Unit(type, "asdasdsa"));
		//this.orderRepository.save(order);
		
		

	}

}

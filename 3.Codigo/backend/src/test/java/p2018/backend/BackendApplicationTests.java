package p2018.backend;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import p2018.backend.orders.Order;
import p2018.backend.orders.OrderRepository;
import p2018.backend.orders.Priority;
import p2018.backend.orders.Status;
import p2018.backend.orders.Unit;
import p2018.backend.orders.UnitType;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BackendApplicationTests {

	@Autowired
	private OrderRepository orderRepository;

	@Test
	public void contextLoads() {
	}

	@Test
	public void test1() {

		UnitType type = new UnitType("AFR", "Aféresis");

		Order order = new Order();
		order.setStatus(Status.PENDING);
		order.setCarrier("asdasd");
		order.setCode("asdasdasdsadas");
		order.setPriority(Priority.NORMAL);

		order.addUnit(new Unit(type, "asdasdsa"));

		this.orderRepository.save(order);

	}

}

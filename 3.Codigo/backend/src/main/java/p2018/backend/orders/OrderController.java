package p2018.backend.orders;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/orders")
public class OrderController {

	@Autowired
	private OrderService orderService;

}

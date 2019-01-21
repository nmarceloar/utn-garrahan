package p2018.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import p2018.backend.service.OrderService;

@RestController("/api/orders")
public class OrderController {

	@Autowired
	private OrderService orderService;

}

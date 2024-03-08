package com.example.santhuongmai.service.impl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.santhuongmai.entity.Orderstatus;
import com.example.santhuongmai.entity.Category;
import com.example.santhuongmai.entity.Image;
import com.example.santhuongmai.entity.Order;
import com.example.santhuongmai.entity.OrderDetail;
import com.example.santhuongmai.entity.Product;
import com.example.santhuongmai.entity.User;
import com.example.santhuongmai.exception.NotFoundException;
import com.example.santhuongmai.model.request.CreateOrderDetailRequest;
import com.example.santhuongmai.model.request.CreateOrderRequest;
import com.example.santhuongmai.model.request.CreateProductRequest;
import com.example.santhuongmai.repository.CategoryRepository;
import com.example.santhuongmai.repository.OrderDetailRepository;
import com.example.santhuongmai.repository.OrderRepository;
import com.example.santhuongmai.repository.UserRepository;
import com.example.santhuongmai.repository.OrderstatusRepository;

import com.example.santhuongmai.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderstatusRepository orderstatusRepository;
    
    @Override
    public void placeOrder(CreateOrderRequest request) {
        // TODO Auto-generated method stub
        Order order = new Order();
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new NotFoundException("Not Found User With Username:" + request.getUsername()));
        order.setFirstname(request.getFirstname());
        order.setLastname(request.getLastname());
        order.setCountry(request.getCountry());
        order.setAddress(request.getAddress());
        order.setTown(request.getTown());
        order.setState(request.getState());
        order.setPostCode(request.getPostCode());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setNote(request.getNote());   
        order.setOrderCode(request.getOrderCode());
        order.setOrderState(0);
//        order.setStatus(request.getStatus());
        Orderstatus orderstatus = orderstatusRepository.findById(request.getStatus()).orElseThrow(()-> new NotFoundException("Not Found Category With Id: " + request.getStatus()));
    	order.setOrderstatus(orderstatus);  
        order.setBank(request.getBank());
        orderRepository.save(order);
        long totalPrice = 0;
        for(CreateOrderDetailRequest rq: request.getOrderDetails()){
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setName(rq.getName());
            orderDetail.setPrice(rq.getPrice());
            orderDetail.setQuantity(rq.getQuantity());
            orderDetail.setSubTotal(rq.getPrice()* rq.getQuantity());
            orderDetail.setOrder(order);
            totalPrice += orderDetail.getSubTotal();
            orderDetailRepository.save(orderDetail);
            
        }
        order.setTotalPrice(totalPrice);
        order.setUser(user);
        orderRepository.save(order);
    }

    @Override
    public List<Order> getList() {
        return orderRepository.findAll(Sort.by("id").descending());
    }
    @Override
    public List<Orderstatus> getListstatus() {
        return orderstatusRepository.findAll(Sort.by("id").descending());
    }
    @Override
    public List<Order> getOrderByUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new NotFoundException("Not Found User With Username:" + username));

        List<Order> orders = orderRepository.getOrderByUser(user.getId());
        return orders;  
    }

    @Override
    public ResponseEntity<?> checkOrder(String code) {
        Order order = orderRepository.findByOrderCode(code).orElseThrow();
        order.setOrderState(1);
        orderRepository.save(order);
        return ResponseEntity.ok(new HashMap<>());
    }

    @Override
    public ResponseEntity<?> removeOrder(String code) {
        return ResponseEntity.ok(new HashMap<>());
    }
    @Override
    public Order updateOrder(long id, CreateOrderRequest request) {
    	
    	// TODO Auto-generated method stub
    	Order order= orderRepository.findById(id).orElseThrow(() -> new NotFoundException("Not Found Product With Id: " + id));
    	
    	Orderstatus orderstatus = orderstatusRepository.findById(request.getStatus()).orElseThrow(()-> new NotFoundException("Not Found Category With Id: " + request.getStatus()));
    	order.setOrderstatus(orderstatus);  
    	orderRepository.save(order);

        return order;
    }
}

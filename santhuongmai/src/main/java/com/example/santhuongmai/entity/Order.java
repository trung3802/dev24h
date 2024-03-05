package com.example.santhuongmai.entity;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Cascade;


import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String firstname;

    private String lastname;

    private String country;

    private String address;

    private String town;

    private String state;

    private long postCode;

    private String email;
    
    private String phone;

    private String note;

    private long totalPrice;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;
    private int orderState = 0;

    private String orderCode;
    @OneToMany(mappedBy = "order",orphanRemoval = true)
    @Cascade(value = {org.hibernate.annotations.CascadeType.PERSIST, org.hibernate.annotations.CascadeType.REMOVE})
    @JsonBackReference
    private Set<OrderDetail> orderdetails;
	/*
	 * @OneToMany(mappedBy="order")
	 * 
	 * @JsonBackReference private Set<OrderDetail> orderdetails;
	 */
}

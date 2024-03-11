import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/_service/order.service';
import { StorageService } from 'src/app/_service/storage.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {
 

  listOrder:any;
  username: any;
  transform(status: number): string {
    switch (status) {
      case 0: return 'Chờ Xác Nhận';
      case 1: return 'Chờ Lấy Hàng';
      case 2: return 'Chờ Giao Hàng';
      case 3: return 'Đã Giao';
      case 4: return 'Đã Hủy';
      case 5: return 'Trả Hàng';
      default: return 'Lỗi Hệ Thống';
    }
  }
  transform1(status: number): string {
    switch (status) {
      case 0: return 'Thanh toán khi nhận hàng';
      case 1: return 'Ví VNPAY';
      default: return '';
    }
  }
  constructor(private orderService: OrderService,private storageService: StorageService){}

  ngOnInit(): void {
    this.username = this.storageService.getUser().username;
    this.getListOrder();
  }
  

  getListOrder(){
    this.orderService.getListOrderByUser(this.username).subscribe({
      next: res=>{
        this.listOrder = res;
        console.log(this.listOrder);
      },error: err =>{
        console.log(err);
      }
    })
  }

}

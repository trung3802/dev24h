import { Component, OnInit } from '@angular/core';
import { faBars, faHeart, faPhone, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/_class/order';
import { OrderDetail } from 'src/app/_class/order-detail';

import { CartService } from 'src/app/_service/cart.service';
import { OrderService } from 'src/app/_service/order.service';
import { StorageService } from 'src/app/_service/storage.service';

@Component({
  selector: 'app-checkpay',
  templateUrl: './checkpay.component.html',
  styleUrls: ['./checkpay.component.css'],
  providers: [MessageService]

})
export class CheckPayComponent implements OnInit {
  username !: string;

  constructor(public cartService: CartService, private orderService: OrderService, private storageService: StorageService) {

  }
  ngOnInit(): void {
    this.username = this.storageService.getUser().username;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('vnp_ResponseCode') == '00') {
      if (searchParams.get('vnp_TxnRef')) {
        this.orderService.checkoutOrder(searchParams.get('vnp_TxnRef')).subscribe({
          next: () => {
            this.cartService.clearCart();
            alert('Đặt hàng thành công');
            
          }
        });
      }
    } else {
      alert('Đơn đặt hàng của bạn đã bị hủy');
      // this.cartService.clearCart();
    }
  }

}

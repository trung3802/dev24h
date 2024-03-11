import { Component, OnInit } from '@angular/core';
import { faBars, faHeart, faPhone, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { MessageService } from 'primeng/api';
import { Order } from 'src/app/_class/order';
import { OrderDetail } from 'src/app/_class/order-detail';
import { UserService } from 'src/app/_service/user.service';
import { CartService } from 'src/app/_service/cart.service';
import { OrderService } from 'src/app/_service/order.service';
import { StorageService } from 'src/app/_service/storage.service';
import { Router } from '@angular/router'; // Import Router



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [MessageService]

})
export class CheckoutComponent implements OnInit {
  heart = faHeart;
  bag = faShoppingBag;
  phone = faPhone;
  bars = faBars;
  showDepartment = false;
  order = new Order();
  listOrderDetail: any[] =[];
  username !: string;

  orderForm :any ={
    firstname: null,
    lastname : null,
    country : null,
    addrest : null,
    town : null,
    state : null,
    postCode: null,
    email: null,
    phone: null,
    note: null
  }
  bank: number = 0; // Mặc định là 0 (thanh toán khi nhận hàng)

  updateBank(event: any) {
    const isChecked = event.target.checked;
    const id = event.target.id;
  
    // Nếu checkbox Thanh Toán VNPay được chọn
    if (id === 'vnpay') {
      // Nếu checkbox được chọn, cập nhật bank = 1, ngược lại cập nhật bank = 0
      this.orderForm.bank = isChecked ? 1 : 0;
      this.isVNPaySelected = isChecked;

    }
  
    // Nếu checkbox Thanh Toán Khi Nhận Hàng được chọn
    if (id === 'payment') {
      // Nếu checkbox được chọn, cập nhật bank = 0, ngược lại cập nhật bank = 1
      this.orderForm.bank = isChecked ? 0 : 1;
      this.isPaymentSelected = isChecked;
      
    }
   }
   isPaymentSelected: boolean = false;
  isVNPaySelected: boolean = false;
   

  
  constructor(private userService: UserService,
    public cartService: CartService,
    private orderService:OrderService,
    private storageService: StorageService,
    private router: Router
    ){
  }
  ngOnInit(): void {
    console.log(this.username);
    // Lấy tên người dùng từ dịch vụ lưu trữ
    this.username = this.storageService.getUser().username;

    // Lấy thông tin người dùng từ API và cập nhật orderForm
    this.userService.getUser(this.username).subscribe(
      (userDetails: any) => {
        this.orderForm.firstname = userDetails.firstname;
        this.orderForm.lastname = userDetails.lastname;
        this.orderForm.country = userDetails.country;
        this.orderForm.address = userDetails.address;
        this.orderForm.town = userDetails.town;
        this.orderForm.state = userDetails.state;
        this.orderForm.postCode = userDetails.postCode;
        this.orderForm.email = userDetails.email;
        this.orderForm.phone = userDetails.phone;
        // Gọi service để đặt hàng
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    );
    // Lấy danh sách sản phẩm từ giỏ hàng
    this.cartService.getItems();
  }
  showDepartmentClick(){
    this.showDepartment = !this.showDepartment;
  }
  placeOrder(){
    this.cartService.items.forEach(res =>{
      let orderDetail : OrderDetail = new OrderDetail;
      orderDetail.name = res.name;
      orderDetail.price = res.price;
      orderDetail.quantity = res.quantity;
      orderDetail.subTotal = res.subTotal;
      this.listOrderDetail.push(orderDetail);
    })
    const {firstname,lastname,country,address,town,state,postCcode,phone,email,note,status,bank} = this.orderForm;
    this.orderService.placeOrder(firstname,lastname,country,address,town,state,postCcode,phone,email,note,status,bank,this.listOrderDetail,this.username).subscribe({
      next: res => {
        console.log(res)
       // Nếu bank bằng 1 (tức là đang sử dụng 'vnpay') và code trả về là '00'
       if (bank === 0) {
        // Chuyển hướng tới trang 'check-vnpay'
        this.router.navigate(['/check-vnpay']);
      }
       else if (bank === 1 && res?.code === '00') {
        // Chuyển hướng tới đường dẫn được trả về từ server
        window.location.assign(res.data);
      }
      // Nếu bank bằng 0 (tức là đang sử dụng 'payment')
       
        this.cartService.clearCart();//xóa giỏ hàng

        // Trừ số lượng sản phẩm từ giỏ hàng
      // this.cartService.items.forEach(item => {
      //   this.productService.updateProductQuantity(item.productId, item.quantity).subscribe({
      //     next: () => {
      //       console.log('Số lượng sản phẩm đã được cập nhật');
      //     },
      //     error: err => {
      //       console.error('Lỗi khi cập nhật số lượng sản phẩm', err);
      //     }
      //   });
      // });
      }, error: err => {
        console.log(err);
      }
    })
  }


}
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../_class/order';
import { OrderDetail } from '../_class/order-detail';

import { map } from 'rxjs/operators';

const ORDER_API = "http://localhost:8080/api/order/";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) { }


  getListOrder():Observable<any>{
    return this.http.get(ORDER_API,httpOptions);
  }
  getListstatus():Observable<any>{
    return this.http.get(ORDER_API + 'status',httpOptions);
  }

  getListOrderByUser(username: string):Observable<any>{
    let params = new HttpParams();
    params = params.append('username',username);
    return this.http.get(ORDER_API + 'user',{params: params});

  }

  placeOrder(firstname: string,lastname:string,country:string,address: string,town: string,state:string,postCode: string,phone:string,email:string,note:string,status: number,bank:number,orderDetails: OrderDetail[],username: string):Observable<any>{
    return this.http.post(ORDER_API +'create',{firstname,lastname,country,address,town,state,postCode,phone,email,note,status,bank,orderDetails,username},httpOptions);
  }
// thống kê
  getTotalRevenue(): Observable<number> {
    // Gọi API để lấy giá trị total_price từ bảng order
    return this.http.get<Order[]>(ORDER_API, httpOptions).pipe(
      map((orders: Order[]) => {
        // Tính toán tổng giá trị total_price từ danh sách order
        return orders.reduce((total, order) => total + order.totalPrice, 0);
      })
    );
  }
  getOders(): Observable<number> {
    return this.getListOrder().pipe(
      map(order => order.length)
    );
  }
  checkoutOrder(orderCode: string | null) {
    return this.http.get(ORDER_API + `checkOrder/${orderCode}`, httpOptions);
  }
  removeOrder(orderCode: string | null) {
    return this.http.delete(ORDER_API + "removeOrder/" + orderCode, httpOptions);
  }
  updateOrder(id: number,status:string):Observable<any>{
    return this.http.put(ORDER_API + 'update/'+id,{status},httpOptions);
  }



}

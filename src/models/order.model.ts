export interface OrderItem {
  order_item_id:string;
    domain:string;
    duration:string;
    price:string;
  }
export interface OrderResponse{
  status:number;
  message:string;
  order_item_id:number;
  user_id:number;
  domain:string;
  duration:number;
  price:number;
}
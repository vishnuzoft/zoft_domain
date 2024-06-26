export interface CartItem {
    domain: string;
    price: number;
    duration: number;
}
export interface CartItems {
    status:number;
    message:string;
    cart_id:number
    domain: string;
    price: number;
    duration: number;
}
export interface CartResponse {
    status:number;
    message: string;
    cart_id: number;
    domain: string;
    price: number;
    duration: number;
    user_id: number;
}
export interface GetCartItemsResponse {
    status:number;
    message: string;
    cartItems: CartItem[];
}

export interface GetCartItemByIdResponse {
    status:number;
    message: string;
    cart_id: number;
    domain: string;
    price: number;
    duration: number;
}
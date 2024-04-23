export interface CartItem {
    domain: string;
    price: string;
    duration: string;
}

export interface CartResponse {
    status:number;
    message: string;
    cart_id: string;
    domain: string;
    price: string;
    duration: string;
    user_id: string
}
export interface GetCartItemsResponse {
    status:number;
    message: string;
    cartItems: CartItem[];
}

export interface DeleteResponse {
    status:number;
    message: string;
    cart_id: string;
    domain: string;
    price: string;
    duration: string;
}
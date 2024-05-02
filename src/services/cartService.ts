import { client, release } from '../config';
import { AuthenticatedRequest, CartItem, CartResponse, DeleteResponse, GetCartItemsResponse, OrderItem, OrderResponse } from '../models';
import { CartRepository } from '../repository';
import { Request } from 'express';
import { customError, validation } from '../utility';

class CartService {
    static async addToCart(req: AuthenticatedRequest): Promise<CartResponse> {
        const dbClient = await client();
        try {
            const user_id = req.user_id || '';
            const { domain, duration, price } = req.body;
            const valid = validation("cart", req.body);

            const cartItem: CartItem = { domain, duration, price };

            console.log(valid);

            const insertedCartItem: CartResponse = await CartRepository.addToCart(dbClient, cartItem, user_id);
            console.log(user_id);

            return {
                status: 201,
                message: "Succesfully Added to Cart",
                cart_id: insertedCartItem.cart_id,
                domain: insertedCartItem.domain,
                duration: insertedCartItem.duration,
                price: insertedCartItem.price,
                user_id: insertedCartItem.user_id
            };
        } catch (error) {
            throw error;
        } finally {
            release(dbClient);
        }
    }

    static async getCartItems(): Promise<GetCartItemsResponse> {
        const dbClient = await client();
        try {
            const cartItems = await CartRepository.getCartItems(dbClient);
            return {
                status: 200,
                message: "Cart Items Retrieved Successfully",
                cartItems: cartItems
            };
        } catch (error) {
            throw error;
        } finally {
            release(dbClient);
        }
    }
    static async deleteCartItem(req: AuthenticatedRequest): Promise<DeleteResponse> {
        const dbClient = await client();
        try {
            const user_id = req.user_id || ''
            const cartId = parseInt(req.params.id);
            const cartItem: CartItem = await CartRepository.getCartItemById(dbClient, cartId, user_id);
            if (!cartItem) {
                throw new customError("Cart item not found", 404);
            }

            const response: CartResponse = await CartRepository.deleteCartItem(dbClient, cartId, user_id);
            console.log(response.cart_id);
            console.log('cart', cartId);

            return {
                status: 200,
                message: "Successfully Deleted From Cart",
                cart_id: response.cart_id,
                domain: response.domain,
                price: response.price,
                duration: response.duration,
            }
        } catch (error) {
            throw error;
        } finally {
            release(dbClient);
        }
    }
    static async createOrderItem(req: AuthenticatedRequest): Promise<OrderResponse> {
        const dbClient = await client();
        try {
            const user_id = req.user_id || '';
            const {
                cart_id,
                domain,
                price,
                duration
            } = req.body
//console.log(req.body);

            const createdOrder: OrderItem = {
                cart_id,
                domain,
                price,
                duration,
                order_item_id: '0'
            }
            const response = await CartRepository.createOrderItem(dbClient, createdOrder, user_id);
console.log('useridd',user_id);
console.log('order',response.order_item_id);

            return {
                status: 200,
                message: "Successfully Created OrderItem",
                order_item_id: response.order_item_id,
                user_id: response.user_id,
                cart_id: response.cart_id,
                domain: response.domain,
                price: response.price,
                duration: response.duration,
            }
        } catch (error) {
            throw error;
        } finally {
            release(dbClient);
        }
    }
}

export { CartService };

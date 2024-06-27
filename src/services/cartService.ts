import { begin, client, commit, release, rollback } from '../config';
import { AuthenticatedRequest, CartItem, CartItems, CartResponse, GetCartItemByIdResponse, GetCartItemsResponse, OrderItem, OrderResponse } from '../models';
import { CartRepository, DomainRepository } from '../repository';
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
            await begin(dbClient);
            const insertedCartItem: CartResponse = await CartRepository.addToCart(dbClient, cartItem, user_id);
            console.log(user_id);
            await commit(dbClient)
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
            await rollback(dbClient);
            throw error;
        } finally {
            release(dbClient);
        }
    }

    static async getCartItems(req: AuthenticatedRequest): Promise<GetCartItemsResponse> {
        const dbClient = await client();
        try {
            const user_id = req.user_id || '';
            await begin(dbClient);
            const cartItems = await CartRepository.getCartItems(dbClient, user_id);
            await commit(dbClient);
            return {
                status: 200,
                message: "Cart Items Retrieved Successfully",
                cartItems: cartItems
            };
        } catch (error) {
            await rollback(dbClient);
            throw error;
        } finally {
            release(dbClient);
        }
    }
    static async getCartItemsById(req: AuthenticatedRequest): Promise<CartItems> {
        const dbClient = await client();
        try {
            const user_id = req.user_id || '';
            const cartId = parseInt(req.params.id);
            await begin(dbClient);
            const cartitem = await CartRepository.getCartItemById(dbClient, cartId, user_id);
            if (!cartitem) {
                throw new customError("Cart not found", 404);
            }
            await commit(dbClient);
            return {
                status: 200,
                message: "Cart Item Retrieved Successfully",
                cart_id: cartitem.cart_id,
                domain: cartitem.domain,
                price: cartitem.price,
                duration: cartitem.duration
            }
        } catch (error) {
            await rollback(dbClient)
            throw error;
        } finally {
            release(dbClient);
        }
    }
    static async deleteCartItem(req: AuthenticatedRequest): Promise<GetCartItemByIdResponse> {
        const dbClient = await client();
        try {
            const user_id = req.user_id || ''
            const cartId = parseInt(req.params.id);
            await begin(dbClient);
            const cartItem: CartItem = await CartRepository.getCartItemById(dbClient, cartId, user_id);
            if (!cartItem) {
                throw new customError("Cart item not found", 404);
            }

            const response: CartResponse = await CartRepository.deleteCartItem(dbClient, cartId, user_id);
            await commit(dbClient);
            return {
                status: 200,
                message: "Successfully Deleted From Cart",
                cart_id: response.cart_id,
                domain: response.domain,
                price: response.price,
                duration: response.duration,
            }
        } catch (error) {
            await rollback(dbClient);
            throw error;
        } finally {
            release(dbClient);
        }
    }
}

export { CartService };

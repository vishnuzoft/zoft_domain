import { PoolClient } from "pg";
import { CartItem, CartResponse } from "../models";

class CartRepository {
    static async addToCart(client: PoolClient, cartItem: CartItem, user_id: string): Promise<CartResponse> {
        try {
            const result = await client.query(
                "INSERT INTO tbl_domain_cart (domain, price, duration,user_id) VALUES ($1, $2, $3, $4) RETURNING cart_id, domain, price, duration,user_id",
                [cartItem.domain, cartItem.price, cartItem.duration, user_id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }


    static async getCartItems(client: PoolClient): Promise<CartItem[]> {
        try {
            const result = await client.query("SELECT cart_id,domain, price, duration FROM tbl_domain_cart");
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    static async getCartItemById(client: PoolClient, cartId: number, user_id: string): Promise<CartItem> {
        try {
            const result = await client.query("SELECT cart_id, domain, price, duration FROM tbl_domain_cart WHERE cart_id = $1 AND user_id=$2", [cartId, user_id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    static async deleteCartItem(client: PoolClient, cartId: number, user_id: string): Promise<CartResponse> {
        try {
            const result = await client.query("DELETE FROM tbl_domain_cart WHERE cart_id = $1 AND user_id=$2 RETURNING cart_id, domain, price, duration", [cartId, user_id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

export { CartRepository };

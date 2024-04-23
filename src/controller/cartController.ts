import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services';
import { CartItem, GetCartItemsResponse } from '../models';

class CartController {
    static async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response=await CartService.addToCart(req);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    static async getCartItems(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cartItems: GetCartItemsResponse = await CartService.getCartItems();
            res.json(cartItems);
        } catch (error) {
            next(error);
        }
    }
    static async deleteCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
           const response= await CartService.deleteCartItem(req);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }
}

export { CartController };

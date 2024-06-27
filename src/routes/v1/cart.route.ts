import express from 'express';
import { CartController } from '../../controller';
import { Authmiddleware } from '../../middlewares';



const router = express.Router();

router.post('/add-to-cart', Authmiddleware, CartController.addToCart);
router.get('/cart-items', Authmiddleware, CartController.getCartItems);
router.delete('/remove-from-cart/:id', Authmiddleware, CartController.deleteCartItem);
router.get('/:id',Authmiddleware,CartController.getcartItemsById);

export { router as CartRoute };

import express from 'express';
import { DomainController } from '../../controller';
import { Authmiddleware } from '../../middlewares';



const router = express.Router();

router.get('/check-availability',Authmiddleware, DomainController.checkDomainAvailability);
router.post('/register-domain', DomainController.registerDomain);
export { router as DomainRoute };

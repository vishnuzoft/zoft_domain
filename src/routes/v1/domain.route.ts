import express from 'express';
import { DomainController } from '../../controller';
import { Authmiddleware } from '../../middlewares';



const router = express.Router();

router.get('/check-availability', DomainController.checkDomainAvailability);
router.post('/register-domain', Authmiddleware, DomainController.registerDomain);
router.get('/all-domains', Authmiddleware, DomainController.getAllDomains);
router.get('/:id', DomainController.getDomainById);
router.get('/check-transfer-availability', DomainController.checkTransferAvailability);
export { router as DomainRoute };

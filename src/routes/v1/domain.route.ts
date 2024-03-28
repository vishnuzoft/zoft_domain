import express from 'express';
import { DomainController } from '../../controller';



const router = express.Router();

router.get('/check-availability', DomainController.checkDomainAvailability);
router.post('/register-domain', DomainController.registerDomain);
export { router as DomainRoute };

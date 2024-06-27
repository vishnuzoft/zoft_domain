import express from 'express';
import { DomainController, MXToolboxController } from '../../controller';
import { Authmiddleware } from '../../middlewares';



const router = express.Router();
router.get('/perform-dns-lookup', MXToolboxController.performDNSLookup);
router.get('/check-availability', DomainController.checkDomainAvailability);
router.get('/get-domain-info', DomainController.getDomainInfo);
//router.post('/register-domain',Authmiddleware, DomainController.registerDomain);
router.post('/register-bulk-domains',Authmiddleware,DomainController.registerBulkDomains);
router.patch('/renew-domain', DomainController.renewDomain);
router.get('/all-domains', Authmiddleware, DomainController.getAllDomains);
router.get('/check-transfer-availability', DomainController.checkTransferAvailability);
router.get('/:id',Authmiddleware, DomainController.getDomainById);
export { router as DomainRoute };

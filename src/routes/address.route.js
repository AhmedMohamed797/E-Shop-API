import { Router } from 'express';
const router = Router();

import {
  createAddress,
  deleteAddress,
  getAddresses,
} from '../controllers/address.controller.js';
import { protect } from './../controllers/auth.controller.js';
import {
  createAddressValidator,
  deleteAddressValidator,
} from '../validators/addressValidator.js';

router.use(protect);

router
  .route('/')
  .post(createAddressValidator, createAddress)
  .get(getAddresses);

router.route('/:id').delete(deleteAddressValidator, deleteAddress);

export default router;

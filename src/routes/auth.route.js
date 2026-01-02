import { Router } from 'express';
const router = Router();
import {
  forgetPassword,
  login,
  resetPassword,
  signup,
  verifyResetPasswordCode,
} from '../controllers/auth.controller.js';
import {
  signupValidator,
  loginValidator,
  resetPasswordValidator
} from '../validators/authValidator.js';

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);

router.route('/forget-password').post(forgetPassword);
router.route('/verify-reset-code').post(verifyResetPasswordCode);
router.route('/reset-password').patch(resetPasswordValidator,resetPassword);

export default router;

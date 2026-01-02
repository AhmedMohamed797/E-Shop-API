import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  resizeProfileImage,
  updateUser,
  updateUserPassword,
  uploadProfileImage,
  getLoggedUserData,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
  updateProfileImg,
} from '../controllers/user.controller.js';
import {
  changePasswordValidator,
  checkUserIdValidator,
  createUserValidator,
  updatePasswordValidator,
  updateUserValidator,
} from '../validators/userValidator.js';
import {
  allowedTo,
  protect,
} from '../controllers/auth.controller.js';
const router = Router();

// User
router.route('/getMe').get(protect, getLoggedUserData, getUser);

router
  .route('/change-password')
  .patch(protect, changePasswordValidator, changeLoggedUserPassword);

router
  .route('/updateMe')
  .patch(protect, updateUserValidator, updateLoggedUserData);

router.route('/deleteMe').delete(protect, deleteLoggedUser);

router
  .route('/update-profile-img')
  .patch(
    protect,
    uploadProfileImage,
    resizeProfileImage,
    updateProfileImg
  );

// Admin
router.use(protect, allowedTo('admin', 'manager'));

router
  .route('/')
  .get(getAllUsers)
  .post(
    uploadProfileImage,
    resizeProfileImage,
    createUserValidator,
    createUser
  );

router
  .route('/:id')
  .get(checkUserIdValidator, getUser)
  .patch(
    uploadProfileImage,
    resizeProfileImage,
    updateUserValidator,
    updateUser
  )
  .delete(checkUserIdValidator, deleteUser);

router
  .route('/update-password/:id')
  .patch(updatePasswordValidator, updateUserPassword);

export default router;

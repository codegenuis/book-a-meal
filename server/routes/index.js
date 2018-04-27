import express from 'express';
import MealController from '../controllers/mealController';
import UserController from '../controllers/userController';
import MenuController from '../controllers/menuController';
import OrderController from '../controllers/orderController';
import authenticate from '../middleware/authenticate';
import authorize from '../middleware/authorize';

import {
  validateAddMeal,
  validateUpdateMeal,
  validateGetMeal,
} from '../middleware/mealValidator';
import {
  validateSignin,
  validateSignup,
} from '../middleware/userValidator';
import validateMenu from '../middleware/menuValidator';
import {
  validateNewOrder,
  validateUpdateOrder,
  validateGetOrder,
} from '../middleware/orderValidator';

// Setup express router
const router = express.Router();

// Customer sign in and sign up
router.post('/auth/signup', validateSignup, UserController.createUser);
router.post('/auth/signin', validateSignin, UserController.signinUser);

// Caterer(Admin) sign in and sign up
router.post('/caterer/auth/signup', validateSignup, UserController.createUser);
router.post('/caterer/auth/signin', validateSignin, UserController.signinUser);


// Get all meals
router.get('/meals', MealController.getAllMeals);
router.get('/meals/:mealId', validateGetMeal, MealController.getMeal);
// Post meal
router.post('/meals', authenticate, authorize, validateAddMeal, MealController.addMeal);
// Update meal
router.put('/meals/:mealId', authenticate, authorize, validateUpdateMeal, MealController.updateMeal);
// Delete meal
router.delete('/meals/:mealId', authenticate, authorize, validateUpdateMeal, MealController.deleteMeal);


// Setup menu
router.post('/menu', authenticate, authorize, validateMenu, MenuController.setupMenu);
// Get menu
router.get('/menu', authenticate, MenuController.getMenu);


// Get all orders
router.get('/orders', authenticate, OrderController.getAllOrders);
// Post Order
router.post('/orders', authenticate, validateNewOrder, OrderController.makeAnOrder);
// Update Order
router.put('/orders/:orderId', authenticate, validateUpdateOrder, OrderController.updateOrder);
// Get Total amount made
router.get('/orders/total', authenticate, authorize, OrderController.getTotalAmount);
// Get orders for specific user
router.get('/orders/users', authenticate, OrderController.getUserOrderHistory);
router.get('/orders/users/:userId', authenticate, validateGetOrder, OrderController.getUserOrderHistory);


// Root path
router.get('/', (req, res) => (
  res.status(200).json({
    message: 'Welcome to Book-A-Meal api',
  })
));

export default router;
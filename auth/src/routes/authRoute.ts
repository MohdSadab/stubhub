import { currentUserMiddleware } from '@sadabkhan/common';
import { requestValidatorMiddleware } from '@sadabkhan/common';
import { Router } from "express";
import { body } from "express-validator";
import { getCurrentUserController, signInController,signOutController, signUpController } from "../controllers/index";

const router=Router();


router.get('/currentuser',currentUserMiddleware,getCurrentUserController);
router.post('/signin',[
    body('email').isEmail().withMessage('Email is invalid '),
    body('password').trim().not().isEmpty().withMessage('password is invalid')
],
requestValidatorMiddleware,
signInController);
router.post('/signout',signOutController);
router.post('/signup',[
    body('email').isEmail().withMessage('Email is invalid '),
    body('password').trim().isLength({min:6,max:20}).withMessage('password must be at between 6 to 20 characters')
],
requestValidatorMiddleware,
signUpController
);

export {router as authRouter};
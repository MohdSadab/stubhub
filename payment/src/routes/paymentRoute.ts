import { authMiddleware } from '@sadabkhan/common';
import { requestValidatorMiddleware } from '@sadabkhan/common';
import { Router } from "express";
import { body } from "express-validator";
import { createPaymentController } from "../controllers/index";

const router=Router();




router.post('/',[
    authMiddleware,
    body('token').trim().not().isEmpty().withMessage('Token is invalid '),
    body('orderId').trim().not().isEmpty().withMessage('orderId is invalid'),
    requestValidatorMiddleware
],
createPaymentController
);

export {router as paymentRouter};
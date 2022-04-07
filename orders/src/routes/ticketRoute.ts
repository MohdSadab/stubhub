import { authMiddleware } from '@sadabkhan/common';
import { requestValidatorMiddleware } from '@sadabkhan/common';
import { Router } from "express";
import { body } from "express-validator";
import { getOrderController, getOrdersController, createOrderController, deleteOrderController } from "../controllers/index";

const router = Router();


router.get('/:orderId', authMiddleware, getOrderController);

router.post('/', [
    authMiddleware,
    body('ticketId').trim().not().isEmpty().withMessage('Ticket Id  is invalid '),
    requestValidatorMiddleware
],
    createOrderController
);

router.get('/', authMiddleware, getOrdersController);

router.delete('/:orderId',
    authMiddleware,
    requestValidatorMiddleware,
    deleteOrderController
);

export { router as orderRouter };
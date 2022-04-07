import { authMiddleware } from '@sadabkhan/common';
import { requestValidatorMiddleware } from '@sadabkhan/common';
import { Router } from "express";
import { body } from "express-validator";
import { getTicketController, getTicketsController, createTicketController, updateTicketController } from "../controllers/index";

const router=Router();


router.get('/:id',getTicketController);

router.post('/',[
    authMiddleware,
    body('title').trim().not().isEmpty().withMessage('Title is invalid '),
    body('price').isFloat({gt:0}).withMessage('price is invalid'),
    requestValidatorMiddleware
],
createTicketController
);

router.get('/',getTicketsController);

router.put('/:id',[
    authMiddleware,
    body('title').trim().not().isEmpty().withMessage('Title is invalid '),
    body('price').isFloat({gt:0}).withMessage('price is invalid'),
    requestValidatorMiddleware
],
requestValidatorMiddleware,
updateTicketController
);

export {router as ticketRouter};
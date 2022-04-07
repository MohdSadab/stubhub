import { Request, Response } from "express";
import { OrderModel } from "../models/orderModel";
import { TicketModel } from "../models/ticketModel";

export const getOrdersController=async (req:Request,res:Response)=>{

    const orders= await OrderModel.find({userId:req.currentUser!.id}).populate('ticket');

    return res.status(200).json(orders)
}

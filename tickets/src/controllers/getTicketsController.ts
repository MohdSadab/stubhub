import { Request, Response } from "express";
import { TicketModel } from "../models/ticketModel";

export const getTicketsController=async (req:Request,res:Response)=>{

    const ticket = await TicketModel.find({});
    res.json(ticket);
}

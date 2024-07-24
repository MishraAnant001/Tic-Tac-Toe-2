import { Request } from "express";

export interface IRequest extends Request{
    userid?:string;
    role?:string;
}
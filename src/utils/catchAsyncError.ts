import { NextFunction, Request, Response } from "express";

const catchAsyncError = (func: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(func(req, res, next)).catch(next);
    }
}

export default catchAsyncError;
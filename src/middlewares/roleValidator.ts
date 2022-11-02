import { NextFunction, Request, Response } from "express"

const isAdmin = true

export const roleValidator = (req: Request, res: Response, next: NextFunction) => {
    if (!isAdmin) return res.status(401).json("Usuario no autorizado")
    next()
}
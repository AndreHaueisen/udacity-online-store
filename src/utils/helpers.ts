import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authorizationHeader = req.headers.authorization ?? '';
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET!);

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

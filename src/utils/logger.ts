import express from 'express';

const logger = (req: express.Request, _: express.Response, next: express.NextFunction): void => {
  console.log(`${req.method} ${req.path}`);

  next();
};

export default logger;

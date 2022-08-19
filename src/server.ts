import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';


// Constants
const app = express();


/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
    // This is clearly not an any type, but still getting the error.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    app.use(compression());
    app.use(helmet());
}



// Export here and start in a diff file (for testing).
export default app;

import { NextFunction, Request, Response, Router } from 'express';
import { post_login, post_signup } from 'src/controllers/auth';
import passport from 'passport'

// Export the base-router
const router = Router();


// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
router.post('/login', passport.authenticate('local', {session: false}), post_login);
router.post('/signup', post_signup)

//This is just a test route:
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
router.use('/post', passport.authenticate('jwt', {session: false}))
router.post('/post', (req, res, next) => {
  res.json({
    message: "You are authenticated"
  })
})

// Export default.
export default router;

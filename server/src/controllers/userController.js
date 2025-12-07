import { UserService } from '../services/userService';

export const UserController = {
  signup: async function(req, res, next) {
    try {
      
      const result = await UserService.signup({email: req.body?.email, password: req.body?.password, username: req.body?.username});

      return res.status(201).json(result);

    } catch (error) {
      next(error);
    }  
  },
  login: async function(req, res, next) {
    try {

      const result = await UserService.login({email: req.body?.email, password: req.body?.password});

      return res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }
};
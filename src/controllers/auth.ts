import { RequestHandler } from 'express';
import User from '../models/user';
import { ApiError } from '../error/apiError';
import bcrypt from 'bcryptjs';
import { generateJwt } from '../util/jwt';
import { validateEmail, validateField, validatePassword } from '../util/validation/validation';
import {
  userAlreadyExists,
  wrongEmail,
  wrongPassword,
} from '../util/validation/validationMessages';

export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameValidationError = validateField(username);

    if (usernameValidationError) {
      next(new ApiError(400, usernameValidationError));
      return;
    }

    const emailValidationError = validateEmail(email);

    if (emailValidationError) {
      next(new ApiError(400, emailValidationError));
      return;
    }

    const passwordValidationError = validatePassword(password);

    if (passwordValidationError) {
      next(new ApiError(400, passwordValidationError));
      return;
    }

    const user = await User.findOne({ email });

    if (user) {
      next(new ApiError(400, userAlreadyExists));
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = new User({ username, email, password: hashedPassword });

    const document = await newUser.save();

    const jwt = generateJwt(document._id.toString());

    res.status(201).json({ accessToken: jwt });
  } catch (error) {
    next(new ApiError(400, 'Failed to sign up'));
  }
};

export const signIn: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = await req.body;

    const emailValidationError = validateEmail(email);

    if (emailValidationError) {
      next(new ApiError(400, emailValidationError));
      return;
    }

    const passwordValidationError = validatePassword(password);

    if (passwordValidationError) {
      next(new ApiError(400, passwordValidationError));
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      next(new ApiError(400, wrongEmail));
      return;
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      next(new ApiError(400, wrongPassword));
      return;
    }

    const jwt = generateJwt(user._id.toString());

    res.status(200).json({
      accessToken: jwt,
    });
  } catch (error) {
    next(new ApiError(400, 'Failed to sign up'));
  }
};

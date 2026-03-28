import * as authService from '../services/auth.service.js';

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { token, user } = await authService.signUp({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await authService.signIn({ email, password });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    await authService.signOut(token);

    res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

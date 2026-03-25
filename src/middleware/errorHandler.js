import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {

  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  res.status(500).json({
    message: 'Internal Server Error',
  });
};

export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = status === 500 ? 'Internal server error' : err.message;

  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON request body';
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path || 'resource'} ID format`;
  } else if (err.name === 'ValidationError') {
    status = 400;
    const details = Object.values(err.errors || {}).map((e) => e.message).filter(Boolean);
    message = details.length > 0 ? details.join(', ') : 'Validation failed';
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already exists` : 'Duplicate record already exists';
  }

  if (status === 500) console.error(err);
  res.status(status).json({
    success: false,
    message,
  });
};
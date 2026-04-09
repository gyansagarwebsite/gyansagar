const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err.stack);

  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: err.message === 'File too large' ? 'File too large! Max size is 5MB.' : err.message
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

export { errorHandler };

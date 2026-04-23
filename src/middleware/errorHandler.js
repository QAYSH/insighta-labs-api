export default (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  if (status === 500) {
    console.error('Unexpected Error:', err);
  } else {
    console.warn(`Client Error (${status}):`, message);
  }
  
  res.status(status).json({
    status: 'error',
    message: message
  });
};
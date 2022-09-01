/**
    Creates a new Error object and set it's httpStatusCode to 500
    then Pass the Created error object to the next function
  
  @param err eror object
  @param next next function
*/
const errorCatch = (err, next) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  next(error);
};

module.exports = errorCatch;

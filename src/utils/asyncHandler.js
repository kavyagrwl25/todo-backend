const asyncHandler = (controllerFun) => {
    return (req, res, next) => {
        Promise.resolve(controllerFun(req, res, next)).catch(next);    
    };
};

export {asyncHandler}

// This utility function is used to wrap asynchronous controller functions in Express.js. It ensures that any errors thrown within the asynchronous function are properly caught and passed to the next middleware (error handler) in the Express.js application. By using this wrapper, you can avoid having to write try-catch blocks in each of your controller functions, making your code cleaner and more maintainable.
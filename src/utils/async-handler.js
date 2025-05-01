const asyncHandler = (fn) => {
    return (req, res, next) =>
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.log(err);
            return next(err);
        });
};

export default asyncHandler;

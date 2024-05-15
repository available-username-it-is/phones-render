const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === "CastError") {
        return res.status(400).json({ err: "Malformatted id" });
    } else if (err.name === "ValidationError") {
        return res.status(400).json({ err: err.message });
    }

    next(err);
}

module.exports = errorHandler;
const protect = (req, res, next) => {
  const { user } = req.session;
  if (!user) {
    res.status(401).json({
      status: "FAILED",
      message: "Unauthorized",
    });
    return;
  } else {
    req.user = user;
    next();
  }
};

module.exports = protect;

const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;
console.log(secretKey);

const authMiddleware = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { error: "Authorization header missing" };
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    ctx.state.user = decoded;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: "Invalid or expired token" };
  }
};

module.exports = authMiddleware;

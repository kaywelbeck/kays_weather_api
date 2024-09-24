const Router = require("koa-router");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

const router = new Router();

const secretKey = process.env.JWT_SECRET;

router.post("/register", async (ctx) => {
  const { username, email, phone, password } = ctx.request.body;

  if (!username || !email || !password) {
    ctx.status = 400;
    ctx.body = { error: "Username, email, and password are required" };
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await ctx.db("users").insert({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    ctx.body = { message: "User registered successfully" };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: "Username or email already exists" };
  }
});

router.post("/login", async (ctx) => {
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { error: "Email and password are required" };
    return;
  }

  const user = await ctx.db("users").where({ email }).first();

  if (!user) {
    ctx.status = 400;
    ctx.body = { error: "Invalid email or password" };
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    ctx.status = 400;
    ctx.body = { error: "Invalid email or password" };
    return;
  }

  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });

  ctx.body = { token };
});
router.use(authMiddleware);
router.post("/change-password", async (ctx) => {
  const userId = ctx.state.user.id;
  const { oldPassword, newPassword, confirmnewPassword } = ctx.request.body;
  const user = await ctx.db("users").where({ id: userId }).first();
  if (!user) {
    ctx.status = 400;

    ctx.body = { error: "User not found" };
    return;
  }
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    ctx.status = 400;
    ctx.body = { error: "Invalid old password" };
    return;
  }
  if (newPassword !== confirmnewPassword) {
    ctx.status = 400;
    ctx.body = { error: "New password and confirm password do not match" };
    return;
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await ctx
    .db("users")
    .where({ id: userId })
    .update({ password: hashedPassword });

  ctx.body = { message: "Password changed successfully" };
});

module.exports = router;

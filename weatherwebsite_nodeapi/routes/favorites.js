const Router = require("koa-router");
const authMiddleware = require("../middleware/auth");

const router = new Router();

router.use(authMiddleware);

router.post("/favorites", async (ctx) => {
  const { city } = ctx.request.body;
  const userId = ctx.state.user.id;

  try {
    await ctx.db("favorite_cities").insert({
      user_id: userId,
      city,
    });

    ctx.body = { message: "City added to favorites" };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: "Error adding city to favorites" };
  }
});

router.get("/favorites", async (ctx) => {
  const userId = ctx.state.user.id;

  try {
    const favorites = await ctx
      .db("favorite_cities")
      .where({ user_id: userId })
      .select("city");

    ctx.body = { favorites };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: "Error retrieving favorite cities" };
  }
});

module.exports = router;

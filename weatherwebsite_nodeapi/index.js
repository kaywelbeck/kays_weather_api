require("dotenv").config();
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const knex = require("knex");
const yamljs = require("yamljs");
const cors = require("@koa/cors");
const { koaSwagger } = require("koa2-swagger-ui");
const knexConfig = require("./db/knexfile");
const weatherRoutes = require("./routes/weather");
const userRoutes = require("./routes/users");
const favoriteRoutes = require("./routes/favorites");

const spec = yamljs.load("./swagger.yaml");
console.log(koaSwagger);
const app = new Koa();
app.use(cors());
const router = new Router();
const db = knex(knexConfig);

app.context.db = db;

app.use(bodyParser());

router.use(weatherRoutes.routes());
router.use(userRoutes.routes());
router.use(favoriteRoutes.routes());

// Set up swagger
app.use(
  koaSwagger({
    routePrefix: "/docs", // host at /docs
    swaggerOptions: { spec },
  })
);

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

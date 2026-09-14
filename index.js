// index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const restaurantsRouter = require("./routes/restaurants");
const reviewsRouter = require("./routes/reviews");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));
app.use(express.json());

app.use("/restaurants", restaurantsRouter);
app.use("/restaurants/:id/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "맛집 리뷰 API 서버가 실행 중입니다" });
});

// 전역 에러 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "서버 에러가 발생했습니다" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다`);
});

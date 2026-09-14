// middleware/checkAuth.js
// 프론트엔드(Supabase Auth로 로그인)가 보낸 토큰을 검증합니다.
// Day53에서 배운 jwt.verify 패턴을 그대로 씁니다.

const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "로그인이 필요합니다" });
  }

  try {
    const decoded = jwt.verify(authHeader, process.env.SUPABASE_JWT_SECRET);
    req.userId = decoded.sub; // Supabase 토큰은 사용자 id를 'sub'에 담습니다
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "유효하지 않은 토큰입니다" });
  }
};

// 로그인 없이도 통과는 시키되, 로그인했다면 userId를 넣어주는 버전
// (예: 목록 조회는 누구나 가능하지만, 본인 글 여부를 표시하고 싶을 때)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  try {
    const decoded = jwt.verify(authHeader, process.env.SUPABASE_JWT_SECRET);
    req.userId = decoded.sub;
  } catch (err) {
    // 토큰이 있어도 잘못됐으면 그냥 비로그인으로 처리
  }
  next();
};

module.exports = { checkAuth, optionalAuth };

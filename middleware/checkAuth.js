// middleware/checkAuth.js (수정본)
// jwt.verify + 비밀키 대신, Supabase에게 직접 "이 토큰 유효해?"라고
// 물어보는 방식입니다. Supabase가 HS256이든 최신 비대칭키
// 방식이든 상관없이 항상 정상 작동합니다.

const supabaseAdmin = require("../config/supabaseAdmin");

const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "로그인이 필요합니다" });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(authHeader);

  if (error || !data.user) {
    return res.status(401).json({ success: false, message: "유효하지 않은 토큰입니다" });
  }

  req.userId = data.user.id; // 기존 코드(routes/restaurants.js 등)와 동일하게 req.userId 사용
  next();
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const { data, error } = await supabaseAdmin.auth.getUser(authHeader);
  if (!error && data.user) {
    req.userId = data.user.id;
  }
  next();
};

module.exports = { checkAuth, optionalAuth };
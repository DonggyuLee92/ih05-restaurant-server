// config/supabaseAdmin.js
// 서버에서만 쓰는 클라이언트입니다. service_role key는
// RLS를 무시하므로, 절대 프론트엔드 코드에 넣으면 안 됩니다.

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabaseAdmin;

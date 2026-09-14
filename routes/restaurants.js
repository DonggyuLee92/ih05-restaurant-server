// routes/restaurants.js

const express = require("express");
const router = express.Router();
const supabaseAdmin = require("../config/supabaseAdmin");
const { checkAuth, optionalAuth } = require("../middleware/checkAuth");

// 맛집 목록 조회 (누구나 가능)
router.get("/", async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, message: "맛집 목록 조회 실패" });
  }
  res.json({ success: true, data });
});

// 맛집 상세 조회 (누구나 가능)
router.get("/:id", async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !data) {
    return res.status(404).json({ success: false, message: "맛집을 찾을 수 없습니다" });
  }
  res.json({ success: true, data });
});

// 맛집 등록 (로그인 필요)
router.post("/", checkAuth, async (req, res) => {
  const { name, category } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "name은 필수입니다" });
  }

  const { data, error } = await supabaseAdmin
    .from("restaurants")
    .insert({ name, category, user_id: req.userId })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ success: false, message: "맛집 등록 실패" });
  }
  res.status(201).json({ success: true, data });
});

// 맛집 삭제 (로그인 필요 + 본인 것만)
router.delete("/:id", checkAuth, async (req, res) => {
  const { data: restaurant } = await supabaseAdmin
    .from("restaurants")
    .select("user_id")
    .eq("id", req.params.id)
    .single();

  if (!restaurant) {
    return res.status(404).json({ success: false, message: "맛집을 찾을 수 없습니다" });
  }

  if (restaurant.user_id !== req.userId) {
    return res.status(403).json({ success: false, message: "본인이 등록한 맛집만 삭제할 수 있습니다" });
  }

  const { error } = await supabaseAdmin.from("restaurants").delete().eq("id", req.params.id);

  if (error) {
    return res.status(500).json({ success: false, message: "삭제 실패" });
  }
  res.json({ success: true, message: "삭제되었습니다" });
});

module.exports = router;

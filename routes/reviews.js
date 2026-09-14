// routes/reviews.js

const express = require("express");
const router = express.Router({ mergeParams: true }); // restaurants.js에서 :id를 이어받기 위함
const supabaseAdmin = require("../config/supabaseAdmin");
const { checkAuth } = require("../middleware/checkAuth");

// 특정 맛집의 리뷰 목록 조회 (누구나 가능)
router.get("/", async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("restaurant_id", req.params.id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ success: false, message: "리뷰 조회 실패" });
  }
  res.json({ success: true, data });
});

// 리뷰 작성 (로그인 필요)
router.post("/", checkAuth, async (req, res) => {
  const { content, rating } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, message: "content는 필수입니다" });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "rating은 1~5 사이여야 합니다" });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .insert({
      restaurant_id: req.params.id,
      user_id: req.userId,
      content,
      rating,
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ success: false, message: "리뷰 작성 실패" });
  }
  res.status(201).json({ success: true, data });
});

// 리뷰 수정 (로그인 필요 + 본인 것만)
router.put("/:reviewId", checkAuth, async (req, res) => {
  const { data: review } = await supabaseAdmin
    .from("reviews")
    .select("user_id")
    .eq("id", req.params.reviewId)
    .single();

  if (!review) {
    return res.status(404).json({ success: false, message: "리뷰를 찾을 수 없습니다" });
  }
  if (review.user_id !== req.userId) {
    return res.status(403).json({ success: false, message: "본인 리뷰만 수정할 수 있습니다" });
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .update({ content: req.body.content })
    .eq("id", req.params.reviewId)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ success: false, message: "수정 실패" });
  }
  res.json({ success: true, data });
});

// 리뷰 삭제 (로그인 필요 + 본인 것만)
router.delete("/:reviewId", checkAuth, async (req, res) => {
  const { data: review } = await supabaseAdmin
    .from("reviews")
    .select("user_id")
    .eq("id", req.params.reviewId)
    .single();

  if (!review) {
    return res.status(404).json({ success: false, message: "리뷰를 찾을 수 없습니다" });
  }
  if (review.user_id !== req.userId) {
    return res.status(403).json({ success: false, message: "본인 리뷰만 삭제할 수 있습니다" });
  }

  const { error } = await supabaseAdmin.from("reviews").delete().eq("id", req.params.reviewId);

  if (error) {
    return res.status(500).json({ success: false, message: "삭제 실패" });
  }
  res.json({ success: true, message: "삭제되었습니다" });
});

module.exports = router;

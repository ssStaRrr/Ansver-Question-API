const express = require("express");
const {addNewAnswerToQuestion, getAllAnswers, getSingleAnswer, editAnswer, deleteAnswer, likeAnswer, unDoLikeAnswer} = require("../controllers/answer");
const {getAccessToRoute} = require("../middlewares/authorization/auth");
const {checkQuestionAndAnswerExist} = require("../middlewares/database/databaseErrorHelpers");
const {getAnswerOwnerAccess} = require("../middlewares/authorization/auth");

const router = express.Router({mergeParams:true});

router.post("/", getAccessToRoute, addNewAnswerToQuestion);
router.get("/", getAllAnswers);
router.get("/:answer_id",checkQuestionAndAnswerExist, getSingleAnswer);
router.put("/:answer_id/edit",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess], editAnswer);
router.delete("/:answer_id/delete",[getAccessToRoute,checkQuestionAndAnswerExist,getAnswerOwnerAccess],deleteAnswer);
router.get("/:answer_id/like",[getAccessToRoute,checkQuestionAndAnswerExist],likeAnswer);
router.get("/:answer_id/undo_like",[getAccessToRoute,checkQuestionAndAnswerExist],unDoLikeAnswer);   

module.exports = router;
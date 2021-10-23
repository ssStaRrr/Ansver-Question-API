const express = require("express");
const {askNewQuestion, getAllQuestions, getQuestion, editQuestion, deleteQuestion,likeQuestion,unDoLikeQuestion} =require("../controllers/question");
const {getAccessToRoute,getQuestionOwnerAccess} = require("../middlewares/authorization/auth");
const {checkQuestionExist} = require("../middlewares/database/databaseErrorHelpers");
const questionQueryMiddleware = require("../middlewares/query/questionQueryMiddleware");
const answerQueryMiddleware = require("../middlewares/query/answerQueryMiddleware");
const answer = require("./answer");
const Question = require("../models/Question");
//api/questions
//api/questions/delete
const router = express.Router(); 

router.get("/",questionQueryMiddleware(Question,{
    population: {
        path: "user",
        select: "name profile_image"
    }
}), getAllQuestions);

router.get("/:id/like",getAccessToRoute,checkQuestionExist,likeQuestion);
router.get("/:id/undo_like",getAccessToRoute,checkQuestionExist,unDoLikeQuestion);
router.post("/ask",getAccessToRoute,askNewQuestion);
router.get("/:id",checkQuestionExist,answerQueryMiddleware(Question, {
    population: [
        {
            path: "user",
            select: "name profile_image",
        },
        {
            path: "answers",
            select: "content"
        }
    ]
}),getQuestion);
router.put("/:id/edit",getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess,editQuestion);
router.delete("/:id/delete",getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess,deleteQuestion);

router.use("/:question_id/answers",checkQuestionExist,answer);

module.exports = router;
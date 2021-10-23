const express = require("express");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const Answer = require("../models/Answer");
const User = require("../models/User");
const Question = require("../models/Question");

const addNewAnswerToQuestion = asyncErrorWrapper( async(req,res,next) => {
    const {question_id}   = req.params;
    const user_id = req.user.id;
    const information = req.body;

    const answer = await Answer.create({
        ...information,
        question: question_id,
        user: user_id
    });
    
    return res.status(200).json({
        success: true, 
        data: answer
    });

});

const getAllAnswers = asyncErrorWrapper( async(req,res,next) =>{
    const {question_id} = req.params;

    const answers = await Answer.find({question:question_id});
    res.status(200)
    .json({
        success: true,
        count: answers.length,
        data: answers
    });
});

const getSingleAnswer = asyncErrorWrapper( async(req,res,next) =>{
    const {answer_id} = req.params;

    const answer = await Answer.findById(answer_id)
    .populate("question"); 
        

    return res.status(200)
    .json({
        success: true,
        data: answer
    });

    //2. yol olarak Promise kullanarak yapabiliriz.
    //const {question_id,answer_id} = req.params;
    //const answers = await Answer.find({question:question_id});

    // const promise1 = new Promise((resolve, reject) => {
    //     answers.forEach(answer => {
    //         if(answer.id==answer_id){ 
    //             resolve(answer);
    //         };
    //     });

    //   });
    //   promise1.then(function(answer){
    //     res.status(200)
    //     .json({
    //     success: true,
    //     data: answer
    //      });
    //   }).catch(function(err) {res.send(e.message)});
    
});

const editAnswer = asyncErrorWrapper( async(req,res,next) =>{
    const {answer_id} = req.params;
    const {content} = req.body;

    const answer = await Answer.findByIdAndUpdate(answer_id,{content}); 
        
    return res.status(200)
    .json({
        success: true,
        data: answer
    });
});

const deleteAnswer = asyncErrorWrapper( async(req,res,next) =>{
    const {answer_id} = req.params;
    const {question_id} = req.params;

    await Answer.findByIdAndRemove(answer_id); 
    const question = await Question.findById(question_id);
    
    question.answers.splice(question.answers.indexOf(answer_id),1);
    question.answerCount = question.answers.length;
    await question.save();
    
    return res.status(200)
    .json({
        success: true,
        data: "Anwer delete operation successful "
    });

});

const likeAnswer = asyncErrorWrapper( async(req,res,next) =>{
    const {answer_id} = req.params;
    const user_id = req.user.id;

    const answer = await Answer.findById(answer_id); 
    if(answer.likes.indexOf(user_id)!=-1) return next( new CustomError("bu kullanıcı zaten like etmiştir",400));

    answer.likes.push(user_id);
    await answer.save();
    
    return res.status(200)
    .json({
        success: true,
        message: "Liked is successful",
        data: answer
    });

});

const unDoLikeAnswer = asyncErrorWrapper( async(req,res,next) =>{
    const {answer_id} = req.params;
    const user_id = req.user.id;

    const answer = await Answer.findById(answer_id); 
    if(answer.likes.indexOf(user_id)==-1) return next( new CustomError("bu kullanıcı zaten like edilmemiş",400));
 
    answer.likes.splice(answer.likes.indexOf(user_id),1);
    await answer.save();
    
    return res.status(200)
    .json({
        success: true,
        message: "Un Do Liked is successful",
        data: answer
    });

});

module.exports = {
    addNewAnswerToQuestion,
    getAllAnswers,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    unDoLikeAnswer
};
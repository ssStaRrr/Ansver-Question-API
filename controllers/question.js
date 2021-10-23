const Question = require("../models/Question");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const askNewQuestion= asyncErrorWrapper (async(req,res,next) => {
    const information = req.body;
    console.log(information);

    const question = await Question.create({
        title: information.title,
        content: information.content,
        user: req.user.id
    });
    return res.status(200).json({
        success: true, 
        data: question
    });

});

const getAllQuestions = asyncErrorWrapper (async(req,res,next) => {

    return res.status(200).json(res.queryResults);
});

const getQuestion =  asyncErrorWrapper (async(req,res,next) => {
    return res.status(200).json(res.queryResults);
});

const editQuestion = asyncErrorWrapper (async(req,res,next) => {
    
    const editInformation =req.body;
    const question = await Question.findByIdAndUpdate(req.params.id,editInformation,{
        new : true,
        runValidators: true
    });
    
    return res.status(200).json({
        success:true,
        data: question
    });

});

const deleteQuestion = asyncErrorWrapper (async(req,res,next) => {
    const {id} = req.params;

    await Question.findByIdAndDelete(id);
    
    return res.status(200).json({
        success:true,
        message: "question delete operation successful"
    });
});

const likeQuestion = asyncErrorWrapper (async(req,res,next) => {
    const {id} = req.params;
    const question = await Question.findById(id);
    
    //Like edilmişse:
    if(question.likes.includes(req.user.id)) return next(new CustomError("You already liked this question",400));

    question.likes.push(req.user.id);
    question.likeCount = question.likes.lenght;
    await question.save();
    return res.status(200).json({
        success: true,
        message: "Liked is successful",
        data: question
    });
});

const unDoLikeQuestion = asyncErrorWrapper (async(req,res,next) => {
    const {id} = req.params;
    const question = await Question.findById(id);

    //Like edilmişse:
    if(!question.likes.includes(req.user.id)) return next(new CustomError("You already didn't liked this question",400));

    const index = question.likes.indexOf(req.user.id);
    question.likes.splice(index,1);
    question.likeCount = question.likes.lenght; 
    await question.save();

    return res.status(200).json({
        success: true,
        message: "UnDO Liked is successful",
        data: question
    });
});

module.exports={
    askNewQuestion,
    getAllQuestions,
    getQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    unDoLikeQuestion
} 
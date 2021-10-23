const CustomError = require("../../helpers/error/CustomError")
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const asyncErrorWrapper = require("express-async-handler");
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");

const getAccessToRoute = (req, res, next) => {

    //Token
    const {JWT_SECRET_KEY} = process.env;
    if(!isTokenIncluded(req)){
        // 401, 403 
        // 401 Unautorized
        // 403 Forbidden
        return next(new CustomError("You are not authorized to access this route",401));
    };
    const accessToken = getAccessTokenFromHeader(req);
    jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded) => {
        if(err) {
            return next(new CustomError("You are not authorized to access this route",401));
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        }
        next();
    });
    //CustomError
};

const getAdminAccess = asyncErrorWrapper(async(req,res,next) => {
    const {id} = req.user;
    const user = await User.findById(id);

    if(user.role!=="admin") {
        return next(new CustomError("Only admins can access this route",403));
    };
    next();
});

const getQuestionOwnerAccess  = asyncErrorWrapper(async(req,res,next) => {
    const questionId =req.params.id;
    const question = await Question.findById(questionId);
    console.log(req.user.id,req.params.id);
    if(req.user.id!=question.user) return next(new CustomError("Only owner can handle this operation.",403));

    next();
});

const getAnswerOwnerAccess  = asyncErrorWrapper(async(req,res,next) => {
    const user_id = req.user.id;
    const answer_id =req.params.answer_id;

    const answer = await Answer.findById(answer_id);

    if(user_id != answer.user) return next(new CustomError("Only owner can handle this operation.",403));

    next();
});

module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
}
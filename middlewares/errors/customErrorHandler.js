const CustomError = require("../../helpers/error/CustomError");
const customerErrorHandler = (err,req,res,next) => {
    let customError=err;
    
    if(customError.name=="CastError"){
        customError = new CustomError("Please provide a valid id",400);
    }
    if(customError.name==="SyntaxError"){
        customError = new CustomError("Unexpected Syntax",400);
    }
    if(customError.name==="ValidationError"){
        customError = new CustomError(err.message,400);
    }
    if(err.code===11000){ 
        //Duplicated Key
        customError= new CustomError("Dublicated Key Found : Check Your Input",400);
    }

    res
    .status(customError.status || 500)
    .json({
        success: false,
        message: customError.message || "İnternal Server Error"
    });
};

module.exports =customerErrorHandler;
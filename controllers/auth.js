const User=require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const {sendJwtToClient} = require("../helpers/authorization/tokenHelpers");
const {validateUserInput, comparePassword} = require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

const register = asyncErrorWrapper ( async (req,res,next) => {
    //Post Data 

        console.log(req.body);
        const {name,email,password,role} = req.body;     // Destruction yöntemi. name = req.body.name, email=req.body.email

         const user= await User.create({
             name,
             email,
             password,
             role
         });
         res.status(200).json({
            success: true,
            data: user
         });
});

const login = asyncErrorWrapper ( async (req,res,next) => {
    const {email,password} = req.body;
    if(!validateUserInput(email,password)){
        return next(new CustomError("Please check your inputs",400));
    };

    const user = await User.findOne({email}).select("+password");
    if(!comparePassword(password,user.password)){
        return next(new CustomError("Please check your credentials",400));
    }
    sendJwtToClient(user,res);
});

const logout = asyncErrorWrapper ( async (req,res,next) => {
    const{NODE_ENV} = process.env;

    return res.status(200)
    .cookie({
        httpOnly: true,
        expires: new Date(Date.now()),             //anlık olarak sona erdir. Gecikme verme. 
        secure: NODE_ENV==="development" ? false : true     //development ortamında güvenlik olmasın.
    })
    .json({
        success: true,
        message: "Logout Successfully"
    });
    
});

const getUser = (req,res,next) => {

    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    })
};
const imageUpload = asyncErrorWrapper ( async (req,res,next) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        "profile_image" : req.savedProfileImage
    },{
        new: true,
        runValidators : true
    });
   
    //İmage Upload Success
    res.status(200)
    .json({
        success: true,
        message: "İmage Upload Successfull",
        data : user
    });
});



//Forgat Password
const forgotPassword = asyncErrorWrapper ( async (req,res,next) => {
    const resetEmail = req.body.email;
    const user =await User.findOne({email: resetEmail});

    if(!user){   //bu tarz obje koşul ifadeleri undefined ise 0 değilse 1 değerini alacak dekilde koşula girer.
        return next(new CustomError("There is no user with that email!",400));
    };
    let resetPasswordToken = user.getResetPasswordTokenFromUser();
    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    const emailTemplate = `
    <h3> Reset Your Password </h3>
    <p> This <a href='${resetPasswordUrl}' target='_blank'>link</a> will expire in 1 hour </p>
    `;

    try {
        await sendEmail({
            from : process.env.SMTP_USER,
            to : resetEmail,
            subject : "Reset Your Password",
            html : emailTemplate
        });
        return res.status(200).
        json({
           success : true,
           message: "Token sent to your Email"
        });
    }
    catch(err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return next(new CustomError("Email Could Not Be sent",500));
    }

});


const resetPassword = asyncErrorWrapper( async(req,res,next)=>{
    const {resetPasswordToken} = req.query;
    const {password} = req.body;

    if(!resetPasswordToken) {
        return next(new CustomError("Please provide a valid Token",400));
    }
    let user = await User.findOne({
        resetPasswordToken:resetPasswordToken, 
        resetPasswordExpire: {$gt: Date.now()}   //gt(greater then) mongoDB'nin bir özelliğidir. RPExpire değeri Date.now'dan büyükse getir anlamındadır.
    });
    if(!user){  //böyle bir kullanıcı bulamadığına göre geçerli bir token atamadığımız  veya expire gecikme süresi dolduğu içindir .
        return next(new CustomError("İnvalid Token or Session Expired"),404);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Reset Password Process Successful" 
    });

});

const editDetails = asyncErrorWrapper(async(req, res, next) => {
    const editInformation = req.body;

    const user = await User.findByIdAndUpdate(req.user.id,editInformation,{
        new : true,
        runValidators: true
    });
    
    return res.status(200).json({
        success: true,
        data: user 
    });
});

module.exports = {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
}
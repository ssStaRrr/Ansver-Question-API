const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

//Block User
const blockUser = asyncErrorWrapper( async(req,res,next) => {
    
    const {id} = req.params;
    const user = await User.findById(id);

    user.blocked = !user.blocked;
    user.save();

    return res.status(200).json({
        success: true,
        message: "Block-Unblock Successfull",
        data: user
    })
});

const deleteUser = asyncErrorWrapper (async(req,res,next) =>{
    const {id} =req.params;
    const user = await User.findById(id);

    await user.remove();
    
    return res.status(200).json({
        success: true,
        message: "Delete Operation Successful"
    })
});

module.exports = {
    blockUser,
    deleteUser
}
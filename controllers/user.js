const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");


var mongoose = require('mongoose');



const getSingleUser = asyncErrorWrapper( async(req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id);
    console.log(user.password);
    return res.status(200).json({
        success: true,
        data: user
    });
});

const getAllUsers = asyncErrorWrapper( async(req, res, next) => {

    return res.status(200).json(res.queryResults);
});

module.exports = {
    getSingleUser,
    getAllUsers
}
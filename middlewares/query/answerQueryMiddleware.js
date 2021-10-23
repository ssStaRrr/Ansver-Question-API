const asyncErrorWrapper = require("express-async-handler");
const { options } = require("../../routers/answer");
const { populateHelper, paginationHelper } = require("./queryMiddlewareHelpers");


const answerQueryMiddleware = (model,options) => {

    return asyncErrorWrapper( async function(req,res,next) {
        const {id} = req.params;
        const arrayName = "answers";
        const total = (await model.findById(id))["answerCount"];
        
        const paginationResult =await paginationHelper(total,undefined,req);
        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;

        // 2 3 4 Pagination
        let queryObject = {};
        queryObject[arrayName] = { $slice: [startIndex, limit] };
        
        let query = model.find({_id: id}, queryObject);

        //Populate
        query = populateHelper(query,options.population);
        const queryResult = await query;

        res.queryResults = {
            success: true,
            pagination: paginationResult.pagination,
            data: queryResult
        }
        next();
    });
};

module.exports = answerQueryMiddleware ;

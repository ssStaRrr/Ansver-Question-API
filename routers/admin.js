const express = require("express");
const {blockUser,deleteUser} = require("../controllers/admin");
const {getAccessToRoute,getAdminAccess} = require("../middlewares/authorization/auth");
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers")

const router = express.Router();

//Block User
//Delete User
router.use([getAccessToRoute,getAdminAccess]); // önce getAccessToRoute çalışacak sonra getAtdmin.
router.get("/block/:id",checkUserExist,blockUser);
router.delete("/user/:id",checkUserExist,deleteUser);
module.exports = router;
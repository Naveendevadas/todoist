const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");  
const verifyToken = require("../middleware/authmiddleware"); 


router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.get("/profile/:id", verifyToken, userController.getProfile);
router.post("/logout",verifyToken, userController.logout);

module.exports = router;

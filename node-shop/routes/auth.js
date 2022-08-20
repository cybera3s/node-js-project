const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignUp);

router.post("/signup", authController.postSignUp);

router.get("/logout", authController.getLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

module.exports = router;

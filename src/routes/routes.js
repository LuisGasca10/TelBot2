const express = require('express');
const whatsAppController = require('../controllers/whatsappControllers')
const router = express.Router();

router
    .get("/", whatsAppController.verifyToken)
    .post("/", whatsAppController.reciveMessage)

module.exports = router;
const express = require('express')
const router = express.Router()

const lobbyController = require('../app/controllers/lobby.controller')

router.get('/newPatient', lobbyController.newPatient)
router.post('/store', lobbyController.store)

module.exports = router
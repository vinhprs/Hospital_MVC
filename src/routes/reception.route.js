const express = require('express')
const router = express.Router()

const receptionController = require('../app/controllers/reception.controller')

router.get('/', receptionController.show)
router.post('/recievePatient', receptionController.recievePatient)
router.post('/sort', receptionController.sort)
router.post('/edit/:index', receptionController.edit)

module.exports = router
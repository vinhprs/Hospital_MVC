const express = require('express')
const router = express.Router()

const doctorRoomController = require('../app/controllers/doctorRoom.controller')

router.get('/', doctorRoomController.show)
router.get('/:id', doctorRoomController.getInDoctorRoom)
router.post('/recievePatient', doctorRoomController.recievePatient)
router.post('/:id/donePatient/:index' , doctorRoomController.donePatient)

module.exports = router
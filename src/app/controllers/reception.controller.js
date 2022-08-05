const doctorModel = require('../models/doctors/doctors')
const receptionModel = require('../models/reception/reception')

class ReceptionController {
    
    // [GET] /reception
    static async show(req, res) {
        const patients = await receptionModel.getPatient()
        const doctors = await doctorModel.getDoctors()

        res.render('area/reception', Object.assign(patients,doctors))
    }

    // [POST] /reception/recievePatient
    static async recievePatient(req, res) {
        const socket = req.app.get('socketIO')

        const [inLobbyData ,inReceptionData] =  await receptionModel.moveToReception()
        socket.emit('moveRepception-form', {inLobbyData ,inReceptionData})

        res.redirect('/lobby/newPatient')
    }
    
    // [POST] /reception/sort
    static async sort(req, res) {
        const socket = req.app.get('socketIO')
        
        const sortDate =  await receptionModel.sortPatients()
        socket.emit('editReception', sortDate)

        res.redirect('/reception')
    }

    // [POST] /reception/edit/:index
    static async edit(req, res) {
        const socket = req.app.get('socketIO')

        const editNumber =  await receptionModel.editPatient(req.body.number, req.params.index)
        socket.emit('editReception', editNumber)
        
        res.redirect('/reception')
    }
} 

module.exports =  ReceptionController
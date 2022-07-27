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

        await receptionModel.moveToReception()

        res.redirect('/lobby/newPatient')
    }
    
    // [POST] /reception/sort
    static async sort(req, res) {
        
        await receptionModel.sortPatients()

        res.redirect('/reception')
    }

    // [POST] /receptio/edit/:index
    static async edit(req, res) {
        await receptionModel.editPatient(req.body.number, req.params.index)
        
        res.redirect('/reception')
    }
} 

module.exports =  ReceptionController
const doctorModel = require('../models/doctors/doctors')

class DoctorController {

    // [GET] /doctorRoom
    static async show(req, res) {
        const doctors = await doctorModel.getDoctors()
        res.render('area/doctorRoom', doctors)
    }

    // [GET] //doctorRoom/:id
    static async getInDoctorRoom(req, res) {
        const doctors = await doctorModel.getDoctors()

        const specificDortoc = doctors.doctors.filter(d => d.id === req.params.id)[0]
        const patients = await doctorModel.getPatients(req.params.id)

        res.render('area/specificDoctor',Object.assign(specificDortoc, patients))
    }

    // [POST] /doctorRoom/:id/recievePatient
    static async recievePatient(req, res) {
        await doctorModel.movetoDoctorRoom()

        res.redirect('/reception')
    } 

    // [POST] /doctorRoom/:id/donePatient
    static async donePatient(req, res) {
        await doctorModel.donePatient(req.params.id, req.params.index)

        res.redirect(`/doctorRoom/${req.params.id}`)
    }
}

module.exports =  DoctorController
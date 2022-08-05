const doctorModel = require('../models/doctors/doctors')

let paramId 
class DoctorController {
    
    // [GET] /doctorRoom
    static async show(req, res) {
        const doctors = await doctorModel.getDoctors()
        res.render('area/doctorRoom', doctors)
    }

    // [GET] //doctorRoom/:id
    static async getInDoctorRoom(req, res) {
        const socket = req.app.get('socketIO')

        const doctors = await doctorModel.getDoctors()

        const specificDortoc = doctors.doctors.filter(d => d.id === req.params.id)[0]
        const patients = await doctorModel.getPatients(req.params.id)

        res.render('area/specificDoctor',Object.assign(specificDortoc, patients))
    }

    // [POST] /doctorRoom/:id/recievePatient
    static async recievePatient(req, res) {
        const socket = req.app.get('socketIO')

        let [inReceptionData, doctorRoomData, invidualDoctor] = await doctorModel.movetoDoctorRoom()

        const dataEmit = {inReceptionData, doctorRoomData, invidualDoctor}
        socket.emit('moveToDoctors', dataEmit)

        res.redirect('/reception')
    } 

    // [POST] /doctorRoom/:id/donePatient
    static async donePatient(req, res) {
        const socket = req.app.get('socketIO')
        
        const [doctorRoomData, patientInRoom] = await doctorModel.donePatient(req.params.id, req.params.index)
        const dataEmit = {doctorRoomData, patientInRoom}
        socket.emit('donePatient', dataEmit)
        res.redirect(`/doctorRoom/${req.params.id}`)
    }
}

module.exports =  DoctorController
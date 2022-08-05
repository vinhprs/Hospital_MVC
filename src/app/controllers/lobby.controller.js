const diseaseHelpers  = require('../helpers/DiseaseHelpers')
const {PriorityQueue, lobbyData} = require('../models/lobby/lobby')

class LobbyController {

    // [GET] /lobby
    static async newPatient(req, res) {
        const patients = await PriorityQueue.getPatient()

        res.render('area/newPatient', patients)
    }

    // [POST] /lobby/store
    static async store(req, res ) {
        const socket = req.app.get('socketIO')
        const formData = req.body
        const priority = diseaseHelpers.getPriority(formData.disease)[0]
        formData.date = new Date().toLocaleString()
        formData.specialist = diseaseHelpers.getSpecialist(formData.disease)[0]
        formData.priority = priority

        await PriorityQueue.Enqueue(formData)

        socket.emit('register-form', lobbyData)

        res.redirect('/lobby/newPatient')
    }
}

module.exports = LobbyController
const diseaseHelpers  = require('../helpers/DiseaseHelpers')
const lobbyModel = require('../models/lobby/lobby')

class LobbyController {

    // [GET] /lobby
    static async newPatient(req, res) {
        const patients = await lobbyModel.getPatient()

        res.render('area/newPatient', patients)
    }

    // [POST] /lobby
    static async store(req, res ) {
        const formData = req.body
        const priority = diseaseHelpers.getPriority(formData.disease)[0]
        formData.date = new Date().toLocaleString()
        formData.specialist = diseaseHelpers.getSpecialist(formData.disease)[0]
        formData.priority = priority
        
        await lobbyModel.Enqueue(formData)

        res.redirect('/lobby/newPatient')
    }
}

module.exports = LobbyController
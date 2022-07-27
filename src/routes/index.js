const lobbyRouter = require('./lobby.route')
const receptionRouter = require('./reception.route')
const homeRouter = require('./home.route')
const doctorRoomRouter = require('./doctorRoom.route')

function route(app) {
    app.use('/lobby', lobbyRouter)
    app.use('/doctorRoom', doctorRoomRouter)
    app.use('/reception', receptionRouter)

    app.use('/', homeRouter)
}

module.exports = route
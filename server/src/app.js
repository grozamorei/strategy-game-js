'use strict'

module.exports.runApp = (testingPort, testingFrequency) => {
    global.Logger = require('js-logger')
    Logger.useDefaults()

    global.ENV = process.env.NODE_ENV
    switch(ENV) {
        case 'TEST':
            Logger.setLevel(Logger.ERROR)
            break
        case 'DEVELOPMENT':
            Logger.setLevel(Logger.INFO)
            break
        case 'RELEASE':
            Logger.setLevel(Logger.OFF)
            break
        default:
            console.warn('Unknown node.env: %s. logger is ON', ENV)
    }

    const http = require('http')

    const settings = require('./util/settings').createSettings()
    const lobby = require('./lobby/lobby').createLobby();
    const router = require('./router').createRouter(lobby)

    const server = http.createServer((req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*")
        router.route(req, res)
    });
    server.listen(ENV == 'TEST' ? testingPort : settings.system.port, () => {
        Logger.info('server successfully run on ', settings.system.port)
    })
    setInterval(lobby.update, ENV == 'TEST' ? testingFrequency : settings.lobby.gameUpdateFrequency)

    if (ENV == 'TEST') {
        return {
            settings: settings,
            lobby: lobby,
            router: router,
            server: server
        }
    }
}

module.exports.closeServer = (server) => {
    server.close()
}

if(require.main === module) {
    module.exports.runApp()
}
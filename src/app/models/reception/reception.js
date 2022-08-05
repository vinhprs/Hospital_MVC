const fileHandler = require('../../config/fileHandler')
const path = require('path')
const joinHelper = require('../../helpers/joinPathHelpers')

const lobbyPath = joinHelper(path.dirname(__dirname), 'lobby/lobby.json')

class NewQueueFile {

        static async moveToReception() {
                try {
                        
                        const [inLobby,inReception] = await 
                        Promise.all([fileHandler.readFile(lobbyPath),fileHandler.readFile(joinHelper(__dirname, 'reception.json'))])
                        const acceptMove = 10 - inReception.items.length
        
                        if(inReception.items.length <10) {    
                            for(let i =0; i< acceptMove; i++) {
                                if(inLobby.array[0]) {
                                    inReception.items.push(inLobby.array[0])
                                    inLobby.array.splice(0,1)   
                                }
                            }   
                           await Promise.all([fileHandler.writeFile(lobbyPath, inLobby),
                                fileHandler.writeFile(joinHelper(__dirname, 'reception.json'), inReception)])
                                .catch(e => {
                                        throw new Error(e)
                                })
                                return [inLobby ,inReception]
                        }
                } catch(e) {
                    throw new Error(e)  
                }
        }

        static async getPatient() {
              try {
                        const patients =  await fileHandler.readFile(joinHelper(__dirname, 'reception.json'))
                      
                      return patients
              } catch {
                throw new Error('Unable to load patients!')
              }
        }

        static async sortPatients() {
                try {
                        const inFile = await fileHandler.sortFile(joinHelper(__dirname, 'reception.json'))
                        return inFile
                } catch {
                        throw new Error('Unable to sort patients!')
                }
        }

        static async editPatient(number, index) {
                try {
                        const inFile = await fileHandler.editFile(joinHelper(__dirname, 'reception.json'), number, index)
                        return inFile
                } catch {
                        throw new Error('Unable to edit patients!')
                }
        }
}

module.exports =  NewQueueFile
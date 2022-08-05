const Queue = require('../../config/priorityQueue')
const fileHandler = require('../../config/fileHandler')
const path = require('path')

const lobbyToSave = {
    "array": []
}

const fileName = path.join(__dirname, 'lobby.json')

class NewQueueFile {

    // add patients to lobby 
    static async Enqueue(data) {
        try {

            await fileHandler.loadLobby(fileName)     
            Queue.push(data)

            while(!Queue.isEmpty()) {
                lobbyToSave.array.push(Queue.pop())
            }
            await fileHandler.writeFile(fileName, lobbyToSave)
        } catch(e) {
            throw new Error(e)
        }
    }    

    static async getPatient() {
        const patients = await fileHandler.readFile(fileName)
        
        return patients
    }
    
}

module.exports =  { PriorityQueue: NewQueueFile, lobbyData: lobbyToSave }
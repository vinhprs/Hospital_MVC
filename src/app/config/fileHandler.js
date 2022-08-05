const fs = require('fs/promises')
const lobby = require('./priorityQueue')

class FileClass {

    // save data into file
    static async writeFile(fileName, data) {
        try {
            await fs.writeFile(fileName,JSON.stringify(data))
        } catch(e) {
            throw new Error(e)
        }
    }

    // get data from lobby
    static async loadLobby(fileName) {
        try {
            const dataBuffer = await fs.readFile(fileName)
            const dataJSON = dataBuffer.toString()

            const inFile = JSON.parse(dataJSON).array
            for(let i in inFile) {
                lobby.push(inFile[i])
            }
        } catch(e) {
            lobby.array = []
        }
    }

    // get data in a file
    static async readFile(fileName) {
        try {
            const dataBuffer = await fs.readFile(fileName)
            const dataJSON = dataBuffer.toString()

            const inFile = JSON.parse(dataJSON)
            return inFile
        } catch(e) {
            return {"items": []}
        }
    }

    // sort patients based on their date
    static async sortFile(fileName) {
        try {
            const inFile = await this.readFile(fileName)

            const fileItem = inFile.items

            // sort method
            function compare( a, b ) {
                if ( a.date < b.date ){
                  return -1;
                }
                if ( a.date > b.date ){
                  return 1;
                }
                return 0;
              }
            fileItem.sort(compare)
            await this.writeFile(fileName, inFile)

            return inFile
        } catch(e) {
            throw new Error(e)
        }
    }

    // add insurance number for patients
    static async editFile(fileName, number, index) {
        try {
            const inFile = await this.readFile(fileName)
            const fileItem = inFile.items

            fileItem[index].number = number

            await this.writeFile(fileName, inFile)
            return inFile
        } catch(e) {
            throw new Error(e)
        }
    }

}

module.exports =  FileClass
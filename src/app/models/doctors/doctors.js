const fileHandler = require('../../config/fileHandler')
const path = require('path')
const joinHelper = require('../../helpers/joinPathHelpers')

const receptionPath = joinHelper(path.dirname(__dirname), 'reception/reception.json')
const doctorFile = joinHelper(__dirname, 'doctors.json')
const doctorHelpers = require('../../helpers/doctorHelpers')
const fs = require('fs')

class NewQueueFile {

    static async getDoctors() {
        try {
            const doctors = await fileHandler.readFile(doctorFile)
            
            return doctors  
        } catch {
            throw new Error('Unable to get doctor list!')
        }
    }

    static async patientSpecialist() {
        try {
            const patients = await fileHandler.readFile(receptionPath)
    
            return patients.items.map(p => ({
                name: p.name,
                age: p.age,
                disease: p.disease,
                date: p.date,
                specialist: p.specialist,
                priority: p.priority
                
            }))
        } catch {
            throw new Error('Fail to get info of patients!')
        }
    }

    static async doctorSpecialist() {
        try {
            const doctors = await fileHandler.readFile(doctorFile)
    
            return doctors.doctors.map(d => ({
                name: d.name,
                id: d.id,
                specialist: d.specialist,
                slot: d.slot,
                currentSlot: d.currentSlot
            }))
        } catch {
            throw new Error('Fail to get specialist of the doctors!')
        }
    }

    static async doctorRooms() {
        const doctorNames = await this.doctorSpecialist()
        for(let i=0; i<doctorNames.length; i++) {
            if(!fs.existsSync(joinHelper(__dirname, `${doctorNames[i].name}.json`)))
            try {
                await fileHandler.writeFile(joinHelper(__dirname, `${doctorNames[i].name}.json`), {"items": []})
            } catch {
                throw new Error('Fail to create doctor rooms!')
            }
        }
    }

    static async updateSlot(name, currentPatients) {
        try {
            const doctors = await fileHandler.readFile(doctorFile)
            for(let i=0; i< doctors.doctors.length; i++) {
                if(doctors.doctors[i].name === name) {
                        doctors.doctors[i].currentSlot = currentPatients
                }
            }
            await fileHandler.writeFile(doctorFile, doctors)
            return doctors
        } catch {
            throw new Error('Fail to update slot!')
        }
    }
    

    static removeFromReception(removeArr, inReception) {
        removeArr.map(e => {
            const index = inReception.items.indexOf(e)
            inReception.items.splice(index, 1)
        })

        return inReception
    }

    static removeDuplicate(invidualDoctor) {
        const filteredArr = invidualDoctor.reduce((acc, current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

        return filteredArr
    }

    static async movePatients(patientSpecialist, doctorSpecialist) {
        const inReception = await fileHandler.readFile(receptionPath)
        const acceptRemove = []
        let doctorData
        const invidualDoctor = []
        try {

            for(let i=0; i< patientSpecialist.length; i++) {
                loopDoctor:
                for(let j=0; j< doctorSpecialist.length; j++) {
                    const inDoctorRoom = await fileHandler.readFile(joinHelper(__dirname, `${doctorSpecialist[j].name}.json`))
                    if(patientSpecialist[i].specialist === doctorSpecialist[j].specialist && inDoctorRoom.items.length < doctorSpecialist[j].slot) {
                        inReception.items[i].doctorID = doctorSpecialist[j].id
    
                        inDoctorRoom.items.push(inReception.items[i])
                        doctorData = await this.updateSlot(doctorSpecialist[j].name, inDoctorRoom.items.length)
    
                        acceptRemove.push(inReception.items[i])
                        await fileHandler.writeFile(joinHelper(__dirname, `${doctorSpecialist[j].name}.json`), inDoctorRoom)

                        invidualDoctor.unshift({
                            'id': doctorSpecialist[j].id,
                            'patients': inDoctorRoom.items
                        })
                        break loopDoctor
                    }
                    invidualDoctor.unshift({
                        'id': doctorSpecialist[j].id,
                        'patients': inDoctorRoom.items
                    })
                }
            }
            const restPatientInReception = this.removeFromReception(acceptRemove, inReception)
            await fileHandler.writeFile(receptionPath, restPatientInReception)
            
            const filterdInvidualDoctor = this.removeDuplicate(invidualDoctor)
            return [restPatientInReception, doctorData, filterdInvidualDoctor]
        } catch {
            throw new Error('Unable to move patients!')
        }
    }

    static async movetoDoctorRoom() {
            const [patientSpecialist, doctorSpecialist] = await Promise.all([this.patientSpecialist(), this.doctorSpecialist()])
            
            const [restPatientInReception, doctorRoomData, invidualDoctor] = await this.movePatients(patientSpecialist, doctorSpecialist)
            await Promise.all([this.doctorRooms(), restPatientInReception])
            .catch(e => {
                throw new Error(e)
            });
            return [restPatientInReception, doctorRoomData, invidualDoctor]
    }

    static async getPatients(id) {
        const doctorName = doctorHelpers.getNameById(id)
        try {
            const patients = await fileHandler.readFile(joinHelper(__dirname, `${doctorName}.json`))
    
            return patients
        } catch {
            throw new Error('Cannot load patients!')
        }
    }

    static async donePatient(id, index) {
        const doctorName = doctorHelpers.getNameById(id)

        try {
            const patientInRoom = await fileHandler.readFile(joinHelper(__dirname, `${doctorName}.json`))

            const doctors = await fileHandler.readFile(doctorFile)
            // cập nhập lại số bệnh nhân đang ở trong phòng
            for(let i=0; i< doctors.doctors.length; i++) {
                if(doctors.doctors[i].id === id && doctors.doctors[i].currentSlot >0) {
                    doctors.doctors[i].currentSlot--
                }
            }
            await fileHandler.writeFile(doctorFile, doctors)

            // xóa bệnh nhân đã được chữa trị (bệnh nhân 0)
            patientInRoom.items.splice(index,1)

            await fileHandler.writeFile(joinHelper(__dirname, `${doctorName}.json`), patientInRoom)
            
            return [doctors, patientInRoom.items]

        } catch(e) {
            throw new Error(e)
        }
    }
}

module.exports =  NewQueueFile
const doctors = require('../models/doctors/doctors.json')

class DoctorHelpers {

    // get doctor name based on specialist
   static  getName(specialist) {
       return doctors.doctors.filter(d => d.specialist === specialist)
       .map(d => d.name)
    }
    
    //static  get doctor id based on name
   static  getId(name) {
        return doctors.doctors.filter(d => d.name === name)
        .map(d => d.id)
    }

    //static  get name by id
   static  getNameById(id) {
        return doctors.doctors.filter(d => d.id === id)
        .map(d => d.name)
    }

    //static  get slot by id
   static  getSlot(id) {
        return doctors.doctors.filter(d => d.id === id)
        .map(d => d.slot)
    }

    //static  get speicalist by id
   static  getSpecialist(id) {
        return doctors.doctors.filter(d => d.id === id)
        .map(d => d.specialist)
    }

    //static  get current slot by id
   static  getCurrentSlot(id) {
        return doctors.doctors.filter(d => d.id === id)
        .map(d => d.currentSlot)
    }
}

module.exports =  DoctorHelpers
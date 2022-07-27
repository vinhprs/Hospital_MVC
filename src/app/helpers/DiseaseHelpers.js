const disease = require('../models/diseases/diseases.json')

class DiseaseHelpers {
    
    // get priority from name
    static  getPriority(name) {
       return disease.filter(d => d.name === name)
        .map(p => p.priority)
    }
    
    // get specialist from disease name
    static getSpecialist(name) {
        return disease.filter(d => d.name === name)
        .map(p => p.specialist)
    }
}


module.exports =  DiseaseHelpers
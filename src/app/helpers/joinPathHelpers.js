const path = require('path')

const manualJoin = function(dir, fileName) {
    return path.join(dir, fileName)
}

module.exports = manualJoin
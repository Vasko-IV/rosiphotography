var path = require('path');
var rootPath = path.normalize(__dirname + '/../../')

module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost/rosiphotography',
        port: process.env.PORT || 3030
    },
    production: {
        rootPath: rootPath,
        db: 'mongodb://admin:dada22@ds031339.mongolab.com:31339/rosiphotography',
        port: process.env.PORT || 3030
    }
}
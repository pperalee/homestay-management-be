const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://<<listening_ip>>:<<port>>/<<database_name>>');
        console.log('Connect database successfully');
    } catch (error) {
        console.log('Connect failure');
    }
}

module.exports = { connect }

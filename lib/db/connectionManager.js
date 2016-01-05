const mongoose = require('mongoose');
const config = require('config');
const logger = require('../logger/logger');
const User = require('./schema/user');
const pollSchema = require('./schema/poll');

function connect(options, callback) {
	var connection = mongoose.createConnection(options.connectionString);

	connection.on('error', err => callback(err));
	connection.once('open', () => callback(null, connection));

	return connection;
}

var connection = connect({
	name: 'default',
	connectionString: config.get('database.connection')

}, err => logger.info('Db connection status: err:' + err));

var UserSchema = new connection.base.Schema(User);
var PollSchema = new connection.base.Schema(pollSchema(connection.base.Schema));

PollSchema.statics.generateId = function() {
	return new mongoose.Types.ObjectId();
};

exports.User = connection.model('User', UserSchema);
exports.Poll = connection.model('Poll', PollSchema);
exports.getConnection = () => connection;
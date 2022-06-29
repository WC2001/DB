const Crypto = require('../modules/Crypto')

class User {
    constructor( nick, password ) {
        this.username = nick;
        this.password = Crypto.hash( password );
        this.friends = [];
    }

    comparePasswords( input ) {
        return Crypto.hash( input ) === this.password;
    }
}

module.exports = { User }
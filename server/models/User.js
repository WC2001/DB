const Crypto = require('../modules/Crypto')

class User {
    constructor( email, password ) {
        this.email = email;
        this.password = Crypto.hash( password );
        this.friends = []
    }

    comparePasswords( input ) {
        return Crypto.hash( input ) === this.password;
    }
}

module.exports = { User }
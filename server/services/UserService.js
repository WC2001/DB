const DBConnection = require("../modules/DB");

class UserService {

    static getAllUsers = async () => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        return connection.collection.find().toArray()
    }

    static createUser = async (user) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        connection.collection.insert(user,  (err, result) => {
            console.log(result)
            return result
        });
    }

    static findUser = async (user) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        return await connection.collection.find({email: user.email, password: user.password}).toArray()
    }

    static getFriends = async (user) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        return connection.collection.findOne(
            { email : user.email },
            { friends: 1 }
        )
    }

    static getStats = async (user) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        connection.collection.findOne(
            { email : user.email },
            { stats: 1 }
        )
    }

    static addGame = async (user, gameID) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        connection.collection.updateOne(
            { email: user.email },
            { $push: { games: gameID }  },
        )
    }

    static doesExist = async (email) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        const user =  connection.collection.findOne(
            { email: email }
        )
        return !!user;
    }
}


module.exports = {UserService}
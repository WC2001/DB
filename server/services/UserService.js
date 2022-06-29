const DBConnection = require("../modules/DB");

class UserService {

    static getAllUsers = async () => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        return connection.collection.find().toArray()
    }

    static createUser = async (user) => {
        console.log(user);
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        connection.collection.insertOne({username:user.username, password: user.password, friends:user.friends},  (err, result) => {
            console.log(result)
            return result
        });
    }

    static findUser = async (user) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        return await connection.collection.find({nick: user.nick, password: user.password}).toArray()
    }

    static getFriends = async (user) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        return connection.collection.findOne(
            { nick : user.nick },
            { friends: 1 }
        )
    }

    static getStats = async (user) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        connection.collection.findOne(
            { nick : user.nick },
            { stats: 1 }
        )
    }

    static addGame = async (user, gameID) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        connection.collection.updateOne(
            { nick: user.nick },
            { $push: { games: gameID }  },
        )
    }

    static doesExist = async (nick) => {
        const connection = await DBConnection.connect("Users", DBConnection.getClient());
        const user = await connection.collection.findOne(
            { username: nick }
        )
        return user !== null && user !== undefined;
    }
}


module.exports = {UserService}
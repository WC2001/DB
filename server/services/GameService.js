const DBConnection = require("../modules/DB");

class GameService {

    static getAllGame = async () => {
        const connection = await DBConnection.connect("Games", DBConnection.getClient());
        return connection.collection.find().toArray()
    }

    static createGame = async (game) => {
        const connection = await DBConnection.connect("Games", DBConnection.getClient());
        const result = await connection.collection.insert(game);
        return result;
    }

    static getPendingGames = async () => {
        const connection = await DBConnection.connect("Games", DBConnection.getClient());
        return connection.collection.find({ status: 'pending' }).toArray()
    }

    static getGameById = async (gameId) => {
        const connection = await DBConnection.connect("Games", DBConnection.getClient());
        return connection.collection.find({ id: gameId })
    }

    static doesExist = async (gameId) => {
        const connection = await DBConnection.connect("Games", DBConnection.getClient());
        const game = await connection.collection.findOne(
            { id: gameId }
        )
        return game !== null && game !== undefined;
    }

    static updateBoardState = (gameId)=> {}

    static endGame = (gameId) => {}
}


module.exports = {GameService}
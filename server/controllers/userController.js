const DBConnection = require("../modules/DB");
const {UserService} = require("../services/UserService");
const {ResponseHelper} = require("../helpers/response");
const {User} = require("../models/User");
const {GameService} = require("../services/GameService");


const getAllUsers = async ( req, res ) => {
    const users = await UserService.getAllUsers();
    res.send(ResponseHelper('ok', users))
}

const getGame = async (req, res)=>{
    const data = await GameService.getGameById('random-test1-1657021978447');
    console.log(data);
    res.send(data ? ResponseHelper('ok', data) : ResponseHelper('failure', []))
}

const getUser = async ( req,res ) => {
    const user = req.body;
    const data = UserService.findUser(user)
    res.send( data ? ResponseHelper('ok', user) : ResponseHelper('bad', []) )
}

const getFriends = async (req, res) => {
    if(req.params.username === '' || req.params.username === '0'){
        res.send(ResponseHelper('No user', []));
    }
    else{
        console.log(req.params.username);
        const data = await UserService.getFriends({username:req.params.username});
        console.log('data:', data[0].friends);
        res.send( data ? ResponseHelper('ok', data[0].friends) : ResponseHelper('bad', []));
    }

}

const getGames = async (req, res)=>{
    if(req.params.username === '' || req.params.username === '0'){
        res.send(ResponseHelper('No user found', []));
    }
    else{
        const data = await GameService.getAllUserGames(req.params.username);
        console.log(data);
        res.send(data ? ResponseHelper('ok', data) : ResponseHelper('bad', []))
    }
};

const login = async ( req,res ) => {
    const user = await UserService.findUser({username:req.body.username, password:req.body.password});
    if (user.length === 0){
        res.send(ResponseHelper('Not registered', []));
    }
    else{
        res.send(ResponseHelper('ok', user));
    }
}

const addUser = async ( req,res ) => {
    const user = new User(req.body.username, req.body.password);
    const exists = await UserService.doesExist( user.username );
    if ( exists ) res.json( {"message": "User Exists"} );
    else{
        await UserService.createUser(user)
        //res.send(ResponseHelper('ok', {"message":"Registered"}));
        res.json({"message":"Registered"});
    }

}

const addFriend = async (req,res) => {
    const data = req.body;
    console.log(data);
    const exists = await UserService.doesExist( data.friend );
    if(data.user === data.friend){
        res.send({message:'Cannot invite yourself.'});
    }
    else if ( exists ){
        await UserService.addFriend(data.user, data.friend);
        await UserService.addFriend(data.friend, data.user);
        res.send({message:'Added.'});
    }
    else{
        res.send({message:'User not found.'});
    }
}

const removeFriend = async (req, res) =>{
    const data = req.body;
    const exists1 = await UserService.friendExists(data.username, data.friend);
    const exists2 = await UserService.friendExists(data.friend, data.username);
    if (exists1 && exists2){
        await UserService.removeFriend(data.username, data.friend);
        await UserService.removeFriend(data.friend, data.username);
        res.send({message:'Removed.'})
    }
    else{
        res.send({message:'Friend not found.'})
    }
}

const addGame = async (req, res) =>{
    const data = req.body;
    const exists = await GameService.doesExist( data.gameId);
    if(exists){
        await UserService.addGame(data.username, data.gameId);
        res.send({message:'Added.'});
    }
    else{
        res.send({message:'Game not found.'});
    }
}

module.exports = {
    addGame,
    addFriend,
    getUser,
    getAllUsers,
    getGames,
    getFriends,
    login,
    addUser,
    getGame,
    removeFriend,
}
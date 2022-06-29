const DBConnection = require("../modules/DB");
const {UserService} = require("../services/UserService");
const {ResponseHelper} = require("../helpers/response");
const {User} = require("../models/User");


const getAllUsers = async ( req, res ) => {
    const users = await UserService.getAllUsers();
    res.send(ResponseHelper('ok', users))
}

const getUser = async ( req,res ) => {
    const user = req.body;
    const data = UserService.findUser(user)
    res.send( data ? ResponseHelper('ok', user) : ResponseHelper('bad', []) )
}

const login = async ( req,res ) => {
    const user = new User(req.body);

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

module.exports = {
    getUser,
    getAllUsers,
    login,
    addUser
}
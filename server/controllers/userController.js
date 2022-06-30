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

const login = async ( req,res ) => {
    //console.log(req.body);
    const user = await UserService.findUser({username:req.body.username, password:req.body.password});
    //console.log(user);
    if (user.length === 0){
        res.send(ResponseHelper('Not registered', []));
    }
    else{
        res.send(ResponseHelper('ok', user));
    }
    //res.send(user ? ResponseHelper('ok', user) : ResponseHelper('Not registered', []));

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
    if ( exists ){
        await UserService.addFriend(data.user, data.friend);
        res.send({message:'Added.'});
    }
    else{
        res.send({message:'User not found.'});
    }

}

module.exports = {
    addFriend,
    getUser,
    getAllUsers,
    getFriends,
    login,
    addUser
}
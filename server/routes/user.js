const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

const cors = require('cors');

router.use(cors({
    origin: 'http://localhost:3000',
}))

router.get('/user/:username/friends', userController.getFriends);
router.get('/user/:id', userController.getUser);
router.get('/users', userController.getAllUsers);
router.get('/userStats', userController.getWins);
router.get('/user/:username/games', userController.getGames);
router.post('/user/add', userController.addFriend);
router.post('/user/addGame', userController.addGame);
router.post('/user/register', userController.addUser);
router.post('/user/login', userController.login);
router.post('/user/remove', userController.removeFriend);

//router.delete('/user/:id', userController.deleteUser);



module.exports = router;
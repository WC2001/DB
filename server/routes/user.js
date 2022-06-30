const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

const cors = require('cors');

router.use(cors({
    origin: 'http://localhost:3000',
}))
router.get('/user/xd', (req,res)=>{ res.json({m:'ok'})});
router.get('/user/:username/friends', userController.getFriends);
router.get('/user/:id', userController.getUser);
router.get('/users', userController.getAllUsers);
router.post('/user/add', userController.addFriend);
router.post('/user/register', userController.addUser);
router.post('/user/login', userController.login);
//router.delete('/user/:id', userController.deleteUser);

module.exports = router;
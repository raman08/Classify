const express = require('express');
const router = express.Router();
const Inst = require('../models/Institute');
const { multerUpload } = require('../utils/multer');

const authController = require('../controllers/authController');

router.get('/login', (req, res) => res.render('login'));

router.get('/forgot', (req, res) => res.render('forgot'));

router.get('/reset/:id', (req, res) => {
	// console.log(id)
	res.render('reset', { id: req.params.id });
});

router.get('/register', async (req, res) => {
	var insts = await Inst.find();
	insts = insts.map(i => {
		return { _id: i._id, name: i.name };
	});
	console.log(insts);
	res.render('register', {
		insts: insts,
	});
});

router.post('/register', multerUpload, authController.registerHandle);

router.get('/activate/:token', authController.activateHandle);

router.post('/forgot', authController.forgotPassword);

router.post('/reset/:id', authController.resetPassword);

router.get('/forgot/:token', authController.gotoReset);

router.post('/login', authController.loginHandle);

router.get('/logout', authController.logoutHandle);

module.exports = router;

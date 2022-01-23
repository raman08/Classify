const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
const Class = require('../models/Class');
const Inst = require('../models/Institute');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_KEY = 'jwtactive987';
const JWT_RESET_KEY = 'jwtreset987';

const { sendMail } = require('../utils/genUtils');

const { isFaculty, isStudent } = require('../utils/genUtils.js');

router.use('/faculty', ensureAuthenticated, isFaculty, require('./faculty'));
router.use('/admin', ensureAuthenticated, require('./admin'));
router.use('/student', ensureAuthenticated, isStudent, require('./student'));

router.get('/', (req, res) => {
	res.render('welcome');
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
	const inst_id = req.user.inst;
	const inst = await Inst.findById(inst_id);
	console.log(inst);

	res.render('home', {
		inst: inst,
		name: req.user.name,
		admin: req.user.admin,
		role: req.user.role,
		id: req.user._id,
	});
});

router.get('/profile/:id', ensureAuthenticated, async (req, res) => {
	const { id } = req.params;
	const u_id = req.user._id;
	const session_user = await User.findById(u_id);
	var ownP = false;
	if (u_id == id) {
		ownP = true;
	}
	const user = await User.findById(id).populate('inst', '_id name');
	res.render('profile', {
		user,
		ownP,
		session_user,
	});
});

module.exports = router;

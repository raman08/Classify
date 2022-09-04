const passport = require('passport');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_KEY = 'jwtactive987';
const JWT_RESET_KEY = 'jwtreset987';

const Inst = require('../models/Institute');
require('dotenv').config();

const { sendMail } = require('../utils/genUtils');
const { uploadFile } = require('../utils/fileUploader');

const User = require('../models/User');

exports.registerHandle = async (req, res) => {
	try {
		const { name, email, password, password2, inst, role, branch, batch } =
			req.body;
		let errors = [];

		let file = req.file;

		let fileUrl = '';

		if (
			!name ||
			!email ||
			!password ||
			!password2 ||
			(role == 'student' && (!branch || !batch))
		) {
			errors.push({ msg: 'Please enter all fields' });
		}

		if (password != password2) {
			errors.push({ msg: 'Passwords do not match' });
		}

		if (password.length < 8) {
			errors.push({ msg: 'Password must be at least 8 characters' });
		}

		var insts = await Inst.find();
		insts = insts.map(i => {
			return { _id: i._id, name: i.name };
		});

		if (errors.length > 0) {
			res.render('register', {
				errors,
				name,
				email,
				password,
				password2,
				inst,
				insts: insts,
			});
		} else {
			if (file) {
				file.filename = `Users/${email}/${
					file.originalname.split('.')[0]
				}_${Date.now()}.${file.mimetype.split('/')[1]}`;

				fileUrl = await uploadFile(file);
			}

			User.findOne({ email: email }).then(user => {
				if (user) {
					errors.push({ msg: 'Email ID already registered' });
					res.render('register', {
						errors,
						name,
						email,
						password,
						password2,
						inst,
						insts: insts,
					});
				} else {

					const token = jwt.sign(
						{
							name,
							email,
							password,
							inst,
							role,
							batch,
							branch,
							fileUrl,
						},
						JWT_KEY,
						{ expiresIn: '30m' }
					);

					const CLIENT_URL = 'http://' + req.headers.host;
					const ur = `${CLIENT_URL}/auth/activate/${token}`;

					console.log(ur);

					const body = `
                        Dear User,
                        Thanks You for signing up at Virtual Classroom.

                        <h4>To activate your account, you must click on the link below:</h4>
                        <p>
                            <a href="${ur}">Activate Account</a>
                        </p>
                        <p><b>NOTE: </b> The above activation link expires in ⏱ 30 minutes. ⏱ </p>

                        <p> Have fun, and don't hesitate to contact us with your feedback. </p>
                    `;

					const subject =
						'Account Verification: Virtual Classroom 👨‍🎓 ';

					const error_flash =
						'Something went wrong on our end. Please register again.';

					const success_flash =
						'Activation link sent to email ID. Please activate to log in.';

					const redirect_url = '/auth/login';

					sendMail(
						req,
						res,
						email,
						subject,
						body,
						redirect_url,
						error_flash,
						success_flash
					);
				}
			});
		}
	} catch (err) {
		console.log(err);
		res.render('error_500');
	}
};

exports.activateHandle = async (req, res) => {
	try {
		const token = req.params.token;
		if (token) {
			jwt.verify(token, JWT_KEY, (err, decodedToken) => {
				if (err) {
					req.flash(
						'error_msg',
						'Incorrect or expired link! Please register again.'
					);
					res.redirect('/auth/register');
				} else {
					const {
						name,
						email,
						password,
						inst,
						role,
						batch,
						branch,
						fileUrl,
					} = decodedToken;

					User.findOne({ email: email }).then(user => {
						if (user) {
							req.flash(
								'error_msg',
								'Email ID already registered! Please log in.'
							);
							res.redirect('/auth/login');
						} else {
							const newUser = new User({
								name,
								email,
								password,
								inst,
								role,
								profileImage: fileUrl,
								verified: true,
							});

							if (role == 'student') {
								console.log('running', { batch, branch });
								newUser.batch = batch;
								newUser.branch = branch;
							}

							bcryptjs.genSalt(10, (err, salt) => {
								bcryptjs.hash(
									newUser.password,
									salt,
									(err, hash) => {
										if (err) throw err;
										newUser.password = hash;
										newUser
											.save()
											.then(user => {
												req.flash(
													'success_msg',
													'Account activated. You can now log in.'
												);
												res.redirect('/auth/login');
											})
											.catch(err => console.log(err));
									}
								);
							});
						}
					});
				}
			});
		} else {
			console.log('Account activation error!');
			req.flash('error_msg', 'Token is invaild');
			res.redirect('/auth/login');
		}
	} catch (err) {
		console.log(err);
		res.render('error_500');
	}
};

exports.forgotPassword = (req, res) => {
	try {
		const { email } = req.body;

		let errors = [];

		if (!email) {
			errors.push({ msg: 'Please enter an email ID' });
		}

		if (errors.length > 0) {
			res.render('forgot', {
				errors,
				email,
			});
		} else {
			User.findOne({ email: email }).then(user => {
				if (!user) {
					errors.push({ msg: 'User with Email ID does not exist!' });
					res.render('forgot', {
						errors,
						email,
					});
				} else {
					const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, {
						expiresIn: '30m',
					});

					User.updateOne(
						{ resetLink: token },
						async (err) => {
							if (err) {
								errors.push({
									msg: 'Error resetting password!',
								});
								res.render('forgot', {
									errors,
									email,
								});
							} else {
								// send mail with defined transport object
								const CLIENT_URL = 'http://' + req.headers.host;

								const subject =
									'Account Password Reset: Virtual Classroom 👨‍🎓';
								const body = `
									<h2>Please click on below link to reset your account password</h2>
									<p>${CLIENT_URL}/auth/forgot/${token}</p>
									<p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
								`;

								const redirect_url = '/auth/forgot';
								const error_flash =
									'Something went wrong on our end. Please try again later.';
								const success_flash =
									'Password reset link sent to email ID. Please follow the instructions.';

								await sendMail(
									req,
									res,
									email,
									subject,
									body,
									redirect_url,
									error_flash,
									success_flash
								);
							}
						}
					);
				}
			});
		}
	} catch (err) {
		console.log(err);
		res.render('error_500');
	}
};

exports.gotoReset = (req, res) => {
	try {
		const { token } = req.params;

		if (token) {
			jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
				if (err) {
					req.flash(
						'error_msg',
						'Incorrect or expired link! Please try again.'
					);
					res.redirect('/auth/login');
				} else {
					const { _id } = decodedToken;
					User.findById(_id, (err, user) => {
						if (err) {
							req.flash(
								'error_msg',
								'User with email ID does not exist! Please try again.'
							);
							res.redirect('/auth/login');
						} else {
							res.redirect(`/auth/reset/${_id}`);
						}
					});
				}
			});
		} else {
			console.log('Password reset error!');
		}
	} catch (err) {
		console.log(err);
		res.render('error_500');
	}
};

exports.resetPassword = (req, res) => {
	try {
		var { password, password2 } = req.body;
		const id = req.params.id;

		if (!password || !password2) {
			req.flash('error_msg', 'Please enter all fields.');
			res.redirect(`/auth/reset/${id}`);
		} else if (password.length < 8) {
			req.flash('error_msg', 'Password must be at least 8 characters.');
			res.redirect(`/auth/reset/${id}`);
		} else if (password != password2) {
			req.flash('error_msg', 'Passwords do not match.');
			res.redirect(`/auth/reset/${id}`);
		} else {
			bcryptjs.genSalt(10, (err, salt) => {
				bcryptjs.hash(password, salt, (err, hash) => {
					if (err) throw err;
					password = hash;

					User.findByIdAndUpdate(
						{ _id: id },
						{ password },
						function (err, result) {
							if (err) {
								req.flash(
									'error_msg',
									'Error resetting password!'
								);
								res.redirect(`/auth/reset/${id}`);
							} else {
								req.flash(
									'success_msg',
									'Password reset successfully!'
								);
								res.redirect('/auth/login');
							}
						}
					);
				});
			});
		}
	} catch (err) {
		console.log(err);
		res.render('error_500');
	}
};

exports.loginHandle = (req, res, next) => {
	try {
		passport.authenticate('local', {
			successRedirect: '/dashboard',
			failureRedirect: '/auth/login',
			failureFlash: true,
		})(req, res, next);
	} catch (err) {
		console.log(err);
		res.render('error_500');
	}
};

exports.logoutHandle = (req, res) => {
	try {
		req.logout();
		req.flash('success_msg', 'You are logged out');
		res.redirect('/auth/login');
	} catch (err) {
		console.log(err);
		res.render('error_500');
	}
};

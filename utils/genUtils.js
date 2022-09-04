const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();

const createTransport = async () => {
	const oauth2Client = new OAuth2(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		'https://developers.google.com/oauthplayground'
	);

	oauth2Client.setCredentials({
		refresh_token: process.env.REFRESH_TOKEN,
	});

	const accessToken = process.env.accessToken;

	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.AUTH_EMAIL,
			clientId: process.env.CLIENT_ID,
			accessToken: accessToken,
			clientSecret: process.env.CLIENT_SECRET,
			refreshToken: process.env.REFRESH_TOKEN,
		},
	});

	return transporter;
};

exports.sendMail = async (
	req,
	res,
	receivers,
	subject,
	body,
	redirect_url,
	error_flash,
	success_flash
) => {
	const transporter = await createTransport();

	const mailOptions = {
		from: process.env.AUTH_EMAIL, // sender address
		to: receivers, // list of receivers
		subject: subject, // Subject line
		generateTextFromHTML: true,
		html: body, // html body
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log({ redirect_url });
			console.log(error);
			req.flash('error_msg', error_flash);
			res.redirect(redirect_url);
		} else {
			console.log('Mail sent : %s', info.response);
			req.flash('success_msg', success_flash);
			res.redirect(redirect_url);
		}
	});
};

exports.isFaculty = (req, res, next) => {
	req.user.role === 'teacher'
		? next()
		: res.send('Are u trying to hack us? You little nerd!! 🤓');
};

exports.isStudent = (req, res, next) => {
	if (req.user.role == 'student') next();
	else res.send('This is not a staff room!! 😒');
};

exports.isAdmin = (req, res, next) => {
	if (req.user.admin) next();
	else res.send('You are not mighty GOD!! 🧚');
};

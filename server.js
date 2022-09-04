require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const Inst = require('./models/Institute');

const app = express();

require('./config/passport')(passport);

app.use(expressLayouts);
app.use('/assets', express.static('./assets'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

app.post('/addInsti', async (req, res) => {
	try {
		console.log(req.body);
		const { name, adminId, inst } = req.body;

		console.log({ name, adminId, inst });
		const institute = new Inst({
			name: name,
			admin: adminId,
			inst: inst,
		});

		await institute.save();

		res.json({
			message: 'Saved Sucessfully',
		});
	} catch (err) {
		res.status(500).json({
			message: err,
		});
	}
});

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

app.use((req, res) => {
	res.render('error_404');
});

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGODB_URI;

mongoose
	.connect(DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('Successfully connected to MongoDB');
		app.listen(PORT, console.log(`Server running on PORT ${PORT}`));
	})
	.catch(err => console.log(err));

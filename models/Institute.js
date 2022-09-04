const mongoose = require('mongoose');

const InstSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			require: true,
		},
		inst: {
			type: String,
			required: true,
		},

		members: {
			students: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
			faculty: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},

		classes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Class',
			},
		],
	},
	{ timestamps: true }
);

const Inst = mongoose.model('Inst', InstSchema);

module.exports = Inst;

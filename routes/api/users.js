const express = require('express');
const router = express.Router();
const util = require('util');
const crypto = require('crypto');

const scrypt = util.promisify(crypto.scrypt);

// User Model
const User = require('../../models/User');

router.post('/login', async (req, res) => {
	const suppliedAttrs = req.body;

	try {
		const savedUser = await User.findOne({ username: suppliedAttrs.username });

		if (!savedUser) {
			throw new Error('User does not exist!');
		}

		const comparePasswords = async (saved, supplied) => {
			// saved is password saved in database => 'hashed.salt'
			// supplied is password given by user
			// const result = saved.split('.');
			// const hashed = result[0];
			// const salt = result[1];
			const [
				hashed,
				salt
			] = saved.split('.');
			const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

			return hashed === hashedSuppliedBuf.toString('hex');
		};

		const match = await comparePasswords(savedUser.password, suppliedAttrs.password);

		if (!match) {
			throw new Error('Incorrect password!');
		}

		res.status(200).json(savedUser);
	} catch (e) {
		res.status(404).json({ success: false });
	}
});

// @route POST api/user
// @desc Post user's top songs
// @access Public
router.post('/signup', async (req, res) => {
	const attrs = req.body;

	try {
		const savedUser = await User.findOne({ username: attrs.username });
		if (savedUser) {
			throw new Error(`${savedUser.username} is already a user!`);
		}

		const salt = crypto.randomBytes(8).toString('hex');
		const buf = await scrypt(attrs.password, salt, 64);

		const newUser = new User({
			...attrs,
			password : `${buf.toString('hex')}.${salt}`
		});

		user = await newUser.save();
		res.status(200).json(user);
	} catch (e) {
		res.status(400).json({ success: false });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const result = await User.findById(req.params.id);
		res.json({ result });
	} catch (err) {
		res.status(404).json({ success: false });
	}
});

module.exports = router;

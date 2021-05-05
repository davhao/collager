const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const users = require('./routes/api/users');
const login = require('./routes/api/login');
const app = express();

app.use(cors());

// Bodyparse Middleware
app.use(express.json({ limit: '100mb' }));

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to Mongo
mongoose
	.connect(db, {
		useNewUrlParser    : true,
		useCreateIndex     : true,
		useUnifiedTopology : true
	})
	.then(() => console.log('MongoDB Connected...'))
	.catch((err) => console.log(err));

// Use Routes
app.use('/api/users', users);
app.use('/api/login', login);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));
	app.use('*', express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

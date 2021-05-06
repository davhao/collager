module.exports = {
	mongoURI      : process.env.mongoURI,
	client_id     : process.env.client_id,
	client_secret : process.env.client_secret,
	redirect_uri  : `https://collager-426.herokuapp.com/api/login/callback`,
	scopes        : 'user-top-read',
	url           : 'https://collager-426.herokuapp.com'
};

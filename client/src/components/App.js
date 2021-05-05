import '../App.css';
import React, { useEffect, useState } from 'react';
import querystring from 'querystring';
import Login from './Login';
import MainPage from './MainPage';

function App() {
	const [
		user,
		setUser
	] = useState(sessionStorage.getItem('user') || null);

	return !user ? <Login setUser={setUser} /> : <MainPage user={user} setUser={setUser} />;
}

export default App;

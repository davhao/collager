import { Button, Form, FormGroup, Input } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackGif from './BackGif';

const Login = (props) => {
	const [
		username,
		setUsername
	] = useState('');
	const [
		password,
		setPassword
	] = useState('');

	const [
		userError,
		setUserError
	] = useState(null);

	const [
		weather,
		setWeather
	] = useState(null);

	const [
		user,
		setUser
	] = useState(props.user || sessionStorage.getItem('user'));

	const signUp = async () => {
		try {
			const res = await axios.post('http://localhost:5000/api/users/signup', {
				username : username,
				password : password
			});

			sessionStorage.setItem('user', res.data.username);
			props.setUser(res.data);
		} catch (e) {
			setUserError('User already exists!');
		}
	};

	const login = async () => {
		try {
			const res = await axios.post('http://localhost:5000/api/users/login', {
				username : username,
				password : password
			});

			sessionStorage.setItem('user', res.data.username);
			props.setUser(res.data);
		} catch (e) {
			setUserError('Incorrect email or password');
		}
	};

	useEffect(async () => {
		const res = await axios.get(
			'https://api.openweathermap.org/data/2.5/weather?zip=27599&appid=7a47ef4085bf456a7e98c7311c379f34&units=imperial'
		);

		setWeather(res.data.main.temp);
	}, []);

	return (
		<div>
			<BackGif />
			<div
				style={{
					display       : 'flex',
					flexDirection : 'column',
					alignItems    : 'center',
					position      : 'relative',
					top           : '25vh'
				}}
			>
				<h1 style={{ marginBottom: '5rem' }}>Spotify Artist Collager</h1>
				<h2>Sign in or create an account</h2>
				<Form style={{ width: '250px' }}>
					<FormGroup>
						<Input
							type="input"
							name="username"
							id="username"
							placeholder="Username"
							onChange={(e) => {
								e.preventDefault();
								setUsername(e.target.value);
							}}
						/>
					</FormGroup>
					<FormGroup style={userError ? { marginBottom: 0 } : null}>
						<Input
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							onChange={(e) => {
								e.preventDefault();
								setPassword(e.target.value);
							}}
						/>
					</FormGroup>
					{userError ? (
						<span
							style={{ display: 'flex', justifyContent: 'center', color: 'red', marginBottom: '.5rem' }}
						>
							{userError.toString()}
						</span>
					) : null}
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Button onClick={() => login()}>Log In</Button>
						<Button onClick={() => signUp()}>Sign Up</Button>
					</div>
				</Form>

				<h3 style={{ marginTop: '5rem' }}>
					It is currently a nice {Math.floor(weather)} degrees here in Chapel Hill, NC :)
				</h3>
			</div>
		</div>
	);
};
export default Login;

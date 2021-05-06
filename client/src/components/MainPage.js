import axios from 'axios';
import React, { useState, useEffect } from 'react';
import querystring from 'querystring';
import { createHash } from 'crypto';
import tforms from './tforms';
import { Spinner, Button } from 'reactstrap';
import BackGif from './BackGif';

const MainPage = (props) => {
	const [
		tokens,
		setTokens
	] = useState(null);

	const [
		collageURL,
		setCollageURL
	] = useState(null);

	const getTopTracks = async () => {
		let res = await axios.get(
			`https://api.spotify.com/v1/me/top/artists/?${querystring.encode({
				time_range : 'short_term',
				limit      : 25
			})}`,
			{
				headers : { Authorization: `Bearer ${tokens.access_token}` }
			}
		);

		const newCloudArtists = [];
		for (let a of res.data.items) {
			const body = {
				file                : a.images[0].url,
				api_key             : '432747473556795',
				timestamp           : Date.now(),
				return_delete_token : true
			};
			const signature = createHash('sha256')
				.update(`return_delete_token=true&timestamp=${body.timestamp}lMX9f3ugxe_87tAoyFM8ayKO8Xk`)
				.digest('hex');
			body.signature = signature;
			res = await axios.post('https://api.cloudinary.com/v1_1/dmi0ptcgf/image/upload', body);
			newCloudArtists.push(res.data);
		}

		let url = `https://res.cloudinary.com/dmi0ptcgf/image/upload/w_500,h_500,c_scale/`;

		for (let i = 1; i < newCloudArtists.length; i++) {
			url += `l_${newCloudArtists[i].public_id},w_500,h_500,c_scale,${tforms[i]}`;
		}

		url += `${newCloudArtists[0].public_id}`;

		setCollageURL(url);

		// const collage = await axios.get(url);
		// setCollage(collage.data);

		// 			for (let t of cloudTracks) {
		// 				axios.post('https://api.cloudinary.com/v1_1/dmi0ptcgf/delete_by_token', { token: t.delete_token });
		// 			}
	};

	useEffect(
		() => {
			if (tokens) {
				getTopTracks();
			}
		},
		[
			tokens
		]
	);

	useEffect(() => {
		const qs = window.location.href.split('?')[1];
		if (qs) {
			setTokens(querystring.parse(qs));
		}
	}, []);

	return (
		<div
			style={{
				display        : 'flex',
				flexDirection  : 'column',
				alignItems     : 'center',
				height         : '100vh',
				justifyContent : 'center'
			}}
		>
			<Button
				onClick={() => {
					props.setUser(null);
					window.location.href = 'https://collager-426.herokuapp.com';
				}}
				style={{
					position : 'absolute',
					top      : '2rem',
					right    : '2rem'
				}}
			>
				Log Out
			</Button>
			<BackGif />
			{!tokens ? (
				<Button onClick={() => (window.location.href = 'https://collager-426.herokuapp.com/api/login')}>
					Generate Collage
				</Button>
			) : !collageURL ? (
				<div
					style={{
						display       : 'flex',
						flexDirection : 'column',
						alignItems    : 'center'
					}}
				>
					<h2>Loading...</h2>
					<Spinner color="success" />
					<span className="green-text">Hold on fam this might take a while...</span>
				</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<h1>{props.user.split('@')[0]}'s Top Artists</h1>
					<img style={{ width: '1000px', maxWidth: '90%' }} src={collageURL} />
				</div>
			)}
		</div>
	);
};

export default MainPage;

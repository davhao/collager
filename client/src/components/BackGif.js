import React, { useState, useEffect } from 'react';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

const BackGif = () => {
	const [
		windowSize,
		setWindowSize
	] = useState(null);
	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width  : window.innerWidth,
				height : window.innerHeight
			});
		}
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const [
		gif,
		setGif
	] = useState(null);

	const giphyFetch = new GiphyFetch('yyOnW5lHhOolAmLlhErX1sD6tcRpezCC');

	const fetch = async () => {
		const { data } = await giphyFetch.search('music kpop video', {
			limit  : 1,
			offset : Math.floor(Math.random() * 200)
		});
		setGif(data[0]);
	};

	useEffect(() => fetch(), []);

	useEffect(() => {
		fetch();
	}, []);

	return windowSize
		? gif && (
				<div style={{ position: 'absolute', zIndex: -1 }}>
					<Gif gif={gif} width={windowSize.width} height={windowSize.height} />
				</div>
			)
		: null;
};

export default BackGif;

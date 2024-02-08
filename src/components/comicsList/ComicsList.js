import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

	const [comicsList, setComicsList] = useState([]);
	const [newComicsLoading, setNewComicsLoading] = useState(false);
	const [offset, setOffset] = useState(0)
	const [comicsEnded, setComicsEnded] = useState(false);

	const { loading, error, getAllComics } = useMarvelService();

	useEffect(() => {
		onRequest(offset, true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setNewComicsLoading(false) : setNewComicsLoading(true)
		getAllComics(offset)
			.then(onComicsListLoaded)
	}

	const onComicsListLoaded = (newComicsList) => {
		let ended = false;
		if (newComicsList.length < 8) {
			ended = true;
		}

		setComicsList([...comicsList, ...newComicsList]);
		setNewComicsLoading(false);
		setOffset(offset + 8);
		setComicsEnded(ended)
	}

	const renderComics = (arr) => {
		const items = arr.map(({ id, title, thumbnail, price }, i) => {
			let imgStyle = { 'objectFit': 'cover' }
			if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
				|| 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
				imgStyle = { 'objectFit': 'unset' }
			}
			return (
				<li className="comics__item"
					key={i}>
					<Link to={`/comics/${id}`}>
						<img src={thumbnail} alt={title} style={imgStyle} className="comics__item-img" />
						<div className="comics__item-name">{title}</div>
						<div className="comics__item-price">{price}</div>
					</Link>
				</li>
			)
		});

		return (
			<ul className="comics__grid">
				{items}
			</ul>
		)
	}

	const items = renderComics(comicsList)
	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading && !newComicsLoading ? <Spinner /> : null;

	return (
		<div className="comics__list">
			{errorMessage}
			{spinner}
			{items}
			<button
				disabled={newComicsLoading}
				style={{ 'display': comicsEnded ? 'none' : 'block' }}
				onClick={() => onRequest(offset)}
				className="button button__main button__long">
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

export default ComicsList;
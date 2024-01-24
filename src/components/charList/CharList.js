import { useState, useEffect, useRef } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {

	const [charList, setCharList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [newItemLoaded, setNewItemLoaded] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const marvelService = new MarvelService()

	/* componentDidMount() {
		this.onRequest()
	} */

	// ниже код на прогрузку новых персонажей при скролле

	useEffect(() => {
		if (offset < 219) {
			onRequest()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onRequest = (offset) => {
		onCharListLoading()
		marvelService.getAllCharacters(offset)
			.then(onCharListLoaded)
			.catch(onError)
	}

	const onCharListLoading = () => {
		setNewItemLoaded(true)
	}

	const onCharListLoaded = (newCharList) => {
		let ended = false
		if (newCharList.length < 9) {
			ended = true
		}

		setCharList(charList => [...charList, ...newCharList]);
		setLoading(false);
		setNewItemLoaded(false);
		setOffset(offset => offset + 9);
		setCharEnded(ended);
	}

	const onError = () => {
		setLoading(false);
		setError(true);
	}

	const myRef = useRef([]);

	const onCharActive = (id) => {

		myRef.current.forEach(item => item.classList.remove("char__item_selected"));

		myRef.current[id].classList.add("char__item_selected");

		myRef.current[id].focus();
	}

	const onCharActveByPress = (e, id) => {
		if (e.key === '' || e.key === 'Enter') {
			e.preventDefault();
			onCharActive(e, id)
		}
	}

	const renderChar = (arr) => {
		const items = arr.map(({ id, name, thumbnail }) => {
			let imgStyle = { 'objectFit': 'cover' }
			if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
				|| 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
				imgStyle = { 'objectFit': 'unset' }
			}
			return (
				<li className="char__item"
					key={id}
					tabIndex={0}
					ref={el => myRef.current[id] = el}
					onClick={() => {
						props.onCharSelect(id)
						onCharActive(id)
					}}
					onKeyDown={(e) => onCharActveByPress(e, id)}>
					<img src={thumbnail} alt={name} style={imgStyle} />
					<div className="char__name">{name}</div>
				</li >
			)
		});

		return (
			<ul className="char__grid" >
				{items}
			</ul>
		)
	}

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const items = renderChar(charList)
	const content = !(loading || error) ? items : null

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{content}
			<button
				disabled={newItemLoaded}
				style={{ 'display': charEnded ? 'none' : 'block' }}
				onClick={() => onRequest(offset)}
				className="button button__main button__long">
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelect: PropTypes.func.isRequired
}

export default CharList;
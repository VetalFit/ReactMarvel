import { useState, useEffect, useRef, useMemo } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
	switch (process) {
		case 'waiting':
			return <Spinner />;
		case 'loading':
			return newItemLoading ? <Component /> : <Spinner />
		case 'succsess':
			return <Component />
		case 'error':
			return <ErrorMessage />;
		default:
			throw new Error('Unexpected process state');
	}
}

const CharList = (props) => {

	const [charList, setCharList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const { getAllCharacters, process, setProcess } = useMarvelService()

	/* componentDidMount() {
		this.onRequest()
	} */

	// ниже код на прогрузку новых персонажей при скролле

	useEffect(() => {
		if (offset < 219) {
			onRequest(offset, true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true)
		getAllCharacters(offset)
			.then(onCharListLoaded)
			.then(() => setProcess('succsess'))
	}

	const onCharListLoaded = (newCharList) => {
		let ended = false
		if (newCharList.length < 9) {
			ended = true
		}

		setCharList(charList => [...charList, ...newCharList]);
		setNewItemLoading(false);
		setOffset(offset => offset + 9);
		setCharEnded(ended);
	}

	const myRef = useRef([]);

	const onCharActive = (id) => {
		myRef.current.forEach(item => item.classList.remove("char__item_selected"));
		myRef.current[id].classList.add("char__item_selected");
		myRef.current[id].focus();
	}

	const renderChar = (arr) => {
		const items = arr.map(({ id, name, thumbnail }, i) => {
			let imgStyle = { 'objectFit': 'cover' }
			if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
				|| 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
				imgStyle = { 'objectFit': 'unset' }
			}
			return (
				<CSSTransition key={id} timeout={500} classNames={"char__item"}>
					<li className="char__item"
						key={id}
						tabIndex={0}
						ref={el => myRef.current[i] = el}
						onClick={() => {
							props.onCharSelect(id)
							onCharActive(i)
						}}
						onKeyDown={(e) => {
							if (e.key === '' || e.key === 'Enter') {
								props.onCharSelect(id)
								onCharActive(i)
							}
						}}>
						<img src={thumbnail} alt={name} style={imgStyle} />
						<div className="char__name">{name}</div>
					</li >
				</CSSTransition>
			)
		});

		return (
			<TransitionGroup component={'ul'} className="char__grid" >
				{items}
			</TransitionGroup>
		)
	}

	/* const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading && !newItemLoading ? <Spinner /> : null;
	const items = renderChar(charList) */

	const elements = useMemo(() => {
		return setContent(process, () => renderChar(charList), newItemLoading)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [process])

	return (
		<div className="char__list">
			{/* {errorMessage}
			{spinner}
			{items} */}
			{elements}
			<button
				disabled={newItemLoading}
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
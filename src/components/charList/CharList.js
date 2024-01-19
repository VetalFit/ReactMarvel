import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
	state = {
		charList: [],
		loading: true,
		error: false,
		newItemLoaded: false,
		offset: 210,
		charEnded: false,
	}

	marvelService = new MarvelService()

	/* componentDidMount() {
		this.onRequest()
	} */

	// ниже код на прогрузку новых персонажей при скролле

	componentDidMount() {
		if (this.state.offset < 219) {
			this.onRequest()
		}
		window.addEventListener('scroll', this.onScroll)
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.onScroll)
	}

	onScroll = () => {
		if (this.state.offset < 219) return;
		if (this.state.newItemLoaded) return;
		if (this.state.charEnded) {
			window.removeEventListener('scroll', this.onScroll)
		}

		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			this.onCharListLoading();
			this.onRequest(this.state.offset)
		}
	}

	onRequest = (offset) => {
		this.onCharListLoading()
		this.marvelService.getAllCharacters(offset)
			.then(this.onCharListLoaded)
			.catch(this.onError)
	}

	onCharListLoading = () => {
		this.setState({
			newItemLoaded: true
		})
	}

	onCharListLoaded = (newCharList) => {
		let ended = false
		if (newCharList.length < 9) {
			ended = true
		}

		this.setState(({ charList, offset }) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			newItemLoaded: false,
			offset: offset + 9,
			charEnded: ended
		}))
	}

	onError = () => {
		this.setState({
			loading: false,
			error: true
		})
	}

	myRef = null;

	createRef = elem => {
		this.myRef = elem
	}

	onCharActive = (e, id) => {
		if (this.myRef) {
			this.myRef.classList.remove("char__item_selected")
		}

		const target = e.target.closest(".char__item")

		this.createRef(target)

		this.myRef.classList.add("char__item_selected")
		this.myRef.focus()

		this.props.onCharSelect(id)
	}

	onCharActveByPress = (e, id) => {
		if (e.key === '' || e.key === 'Enter') {
			e.preventDefault();
			this.onCharActive(e, id)
		}
	}

	renderChar = (arr) => {
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
					onClick={(e) => this.onCharActive(e, id)}
					onKeyDown={(e) => this.onCharActveByPress(e, id)}>
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

	render() {
		const { charList, error, loading, offset, newItemLoaded, charEnded } = this.state;
		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const items = this.renderChar(charList)
		const content = !(loading || error) ? items : null

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button
					disabled={newItemLoaded}
					style={{ 'display': charEnded ? 'none' : 'block' }}
					onClick={() => { this.onRequest(offset) }}
					className="button button__main button__long">
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelect: PropTypes.func.isRequired
}

export default CharList;
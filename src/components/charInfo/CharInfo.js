/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {

	const [char, setChar] = useState(null);

	const { getCharacter, clearError, process, setProcess } = useMarvelService();

	useEffect(() => {
		updateChar();
	}, [])

	useEffect(() => {
		updateChar();
	}, [props.charId])

	const updateChar = () => {
		const { charId } = props;
		if (!charId) {
			return;
		}

		clearError();
		getCharacter(charId)
			.then(onCharLoaded)
			.then(() => setProcess('succsess'))
	}

	const onCharLoaded = (char) => {
		setChar(char);
	}

	/* const skeleton = char || loading || error ? null : <Skeleton />;
	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !(loading || error || !char) ? <View char={char} /> : null; */

	return (
		<div className='char__info-main'>
			<div className="char__info">
				{/* {skeleton}
				{errorMessage}
				{spinner}
				{content} */}
				{setContent(process, View, char)}
			</div>
		</div>
	)
}

const View = ({ data }) => {
	const { name, description, thumbnail, homepage, wiki, comics } = data

	let imgStyle = { 'objectFit': 'cover' }
	if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
		|| 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
		imgStyle = { 'objectFit': 'unset' };
	}

	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} alt={name} style={imgStyle} />
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">
				{description}
			</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				{comics.length > 0 ? null : 'There is no have comics'}

				{comics.slice(0, 10).map((item, i) => {
					const comicId = item.resourceURI.substring(43);
					return (
						<Link
							to={`/comics/${comicId}`}
							key={i}
							className="char__comics-item">
							{item.name}
						</Link>
					)
				})
				}
			</ul>
		</>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number
}

export default CharInfo;
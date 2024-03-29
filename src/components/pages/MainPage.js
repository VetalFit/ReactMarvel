import { useState } from "react";
import { Helmet } from "react-helmet";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../../errorBoundary/ErrorBoundary";
import CharForm from "../charForm/charForm";

import decoration from '../../resources/img/vision.png';


const MainPage = () => {

	const [selectedChar, setChar] = useState(null);

	const onCharSelect = (id) => {
		setChar(id);
	}

	return (
		<>
			<Helmet>
				<meta
					name="description"
					content="Marvel information portal" />
				<title>Marvel information portal</title>
			</Helmet>
			<ErrorBoundary>
				<RandomChar />
			</ErrorBoundary>
			<div className="char__content">
				<ErrorBoundary>
					<CharList onCharSelect={onCharSelect} />
				</ErrorBoundary>
				<div style={{ 'position': 'sticky', 'top': '30px' }}>
					<ErrorBoundary>
						<CharInfo charId={selectedChar} />
					</ErrorBoundary>
					<ErrorBoundary>
						<CharForm />
					</ErrorBoundary>
				</div>
			</div>
			<img className="bg-decoration" src={decoration} alt="vision" />
		</>
	)
}

export default MainPage;
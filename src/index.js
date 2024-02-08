import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/App';
import './style/style.scss';

/* const marvelService = new MarvelService();

marvelService.getAllCharacters().then(res => res.data.results.forEach(item => console.log(item.name)));
marvelService.getCharacter().then(res => console.log(res)) */

ReactDOM
	.createRoot(document.getElementById('root'))
	.render(
		//<React.StrictMode>
		<App />
		//</React.StrictMode>
	);


// React 17 version

/* ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
); */


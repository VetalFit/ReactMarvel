import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Spinner from '../spinner/Spinner';
import { lazy, Suspense } from 'react';

import AppHeader from "../appHeader/AppHeader";

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SinglePage = lazy(() => import('../pages/singlePage'));
const SingleComicLayout = lazy(() => import('../pages/singleComicLayout/singleComicLayout'));
const SingleCharacterLayout = lazy(() => import('../pages/singleCharacterLayout/singleCharacterLayout'));

const App = () => {

	return (
		<Router>
			<div className="app">
				<AppHeader />
				<main>
					<Suspense fallback={<Spinner />}>
						<Routes>
							<Route path='/' element={<MainPage />} />
							<Route path='/comics' element={<ComicsPage />} />
							<Route path='/comics/:id' element={<SinglePage Component={SingleComicLayout} dataType={'comic'} />} />
							<Route path='/characters/:id' element={<SinglePage Component={SingleCharacterLayout} dataType={'characters'} />} />
							<Route path='*' element={<Page404 />} />
						</Routes>
					</Suspense>
				</main >
			</div >
		</Router>
	)
}

export default App;
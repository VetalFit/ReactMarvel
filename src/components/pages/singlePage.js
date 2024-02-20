import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import useMarvelService from "../../services/MarvelService";
import setContent from "../../utils/setContent";
import AppBanner from "../appBanner/AppBanner";

const SinglePage = ({ Component, dataType }) => {
	const { id } = useParams();
	const [data, setData] = useState(null);
	const { getComic, getCharacter, clearError, process, setProcess } = useMarvelService();

	useEffect(() => {
		updateData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	const updateData = () => {
		clearError();

		// eslint-disable-next-line default-case
		switch (dataType) {
			case 'comic':
				getComic(id).then(onDataLoaded).then(() => setProcess('succsess'));
				break;
			case 'characters':
				getCharacter(id).then(onDataLoaded).then(() => setProcess('succsess'));
				break;
		}
	}

	const onDataLoaded = (data) => {
		setData(data)
	}

	/* const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !(loading || error || !data) ? <Component data={data} /> : null; */


	return (
		<>
			<AppBanner />
			{/* {errorMessage}
			{spinner}
			{content} */}
			{setContent(process, Component, data)}
		</>
	)
}

export default SinglePage;
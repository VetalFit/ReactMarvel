import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
	const { loading, request, error, clearError } = useHttp();

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _apiKey = 'apikey=9ce3a5eebfb823b8e4e4aef73ac55005';
	const _baseoffset = 210;

	const getAllCharacters = async (offset = _baseoffset) => {
		const res = await request(`${_apiBase}characters?limit=9&offset=${offset}}&${_apiKey}`)
		return res.data.results.map(_transformCharacter);
	}

	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
		return _transformCharacter(res.data.results[0])
	}

	const _transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name.length > 22 ? `${char.name.slice(0, 22)}...` : char.name,
			description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no have description',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items
		}
	}

	return { loading, error, clearError, getAllCharacters, getCharacter }
}

export default useMarvelService;
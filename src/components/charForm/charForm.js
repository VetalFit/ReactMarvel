import { useState } from "react";
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from "formik";
//import * as Yup from 'yup';

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './charForm.scss'
import { Link } from "react-router-dom";

const CharForm = () => {
	const [char, setChar] = useState(null);
	const { getCharacterByName, clearError, process, setProcess } = useMarvelService();


	const onCharLoaded = (char) => {
		setChar(char);
	}

	const updateChar = (name) => {
		clearError();

		getCharacterByName(name)
			.then(onCharLoaded)
			.then(() => setProcess('succsess'))
	}

	const errorMessage = process === 'error' ? <div className="char__critical-error"><ErrorMessage /></div> : null;
	const results = !char ? null : char.length > 0 ?
		<div className="char__wrapper">
			<div className="char__success">There is! Visit {char[0].name} page?</div>
			<Link to={`/characters/${char[0].id}`} className="button button__secondary">
				<div className="inner">to page</div>
			</Link>
		</div> :
		<div className="char__error">
			The character was not found. Check the name and try again
		</div>

	return (
		<div className="char__form">
			<Formik
				initialValues={{
					charName: ''
				}}
				/* validationSchema={Yup.object({
					charName: Yup.string()
						.required('This failed is required')
				})} */
				onSubmit={({ charName }) => {
					updateChar(charName)
				}}
			>
				<Form>
					<label className="char__label" htmlFor="charName">Or find a character by name</label>
					<div className="char__wrapper">
						<Field
							id="charName"
							name="charName"
							type="text"
							placeholder="Enter Name" />
						<button
							type="submit"
							className="button button__main"
							disabled={process === 'loading'}>
							<div className="inner">find</div>
							<FormikErrorMessage component="div" className="char__error" name="charName" />
						</button>
					</div>
				</Form>
			</Formik>
			{results}
			{errorMessage}
		</div>
	)
}

export default CharForm; 
import React from 'react'
import BaseComponent from './BaseComponent'

class BaseComponentWithAutoComplete extends BaseComponent {

  	// Autosuggest will call this function every time you need to update suggestions.
  	// You already implemented this logic above, so just use it.
  	onSuggestionsFetchRequested = ({ value }) => {
    	this.setState({
      		suggestions: this.getSuggestions(value)
    	});
  	};

  	// Autosuggest will call this function every time you need to clear suggestions.
  	onSuggestionsClearRequested = () => {
    	this.setState({
      		suggestions: []
    	});
  	};

	onChangeSuggestionSearch = (event, { newValue }) => {
		this.setState({
			selectedSuggestion: newValue
		});
	};

	onKeyDownSuggestionSearch = (event) => {
		console.log("onKeyDownSuggestionSearch")
	};

	onBlurSuggestionSearch = (event) => {
		console.log("onBlurSuggestionSearch")
	};

	renderInputComponent = inputProps => (
		<div className="columns input-group input-wrapper">
			<span className="input-group-label">
				<svg className="icon"><use xlinkHref="#icon-search"></use></svg>
			</span>
			<div className="input-wrapper">
				<input {...inputProps} className="input-group-field"/>
			</div>
		</div>
	);

	renderSuggestionsContainer = ({containerProps, children, query }) => {
		return (
			<div {... containerProps}>
			{children}
			</div>
		);
	};

	// componentDidUpdate(prevProps, prevState){
	// 	super.componentDidUpdate(prevProps, prevState)
	// }

}
export default BaseComponentWithAutoComplete

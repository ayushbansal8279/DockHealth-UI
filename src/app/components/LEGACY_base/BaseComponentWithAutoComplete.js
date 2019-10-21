import React, { PureComponent } from 'react';

class BaseComponentWithAutoComplete extends PureComponent {
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onChangeSuggestionSearch = (event, { newValue }) => {
    this.setState({
      selectedSuggestion: newValue,
    });
  };

  renderInputComponent = inputProps => (
    <div className="columns input-group input-wrapper">
      <span className="input-group-label">
        <svg className="icon">
          <use xlinkHref="#icon-search" />
        </svg>
      </span>
      <div className="input-wrapper">
        <input {...inputProps} className="input-group-field" />
      </div>
    </div>
  );

  renderSuggestionsContainer = ({ containerProps, children }) => {
    return <div {...containerProps}>{children}</div>;
  };
}
export default BaseComponentWithAutoComplete;

import React from 'react';
import BaseComponent from '../BaseComponent'
import SearchInput, {createFilter} from 'react-search-input'

//let AddTaskForm = props => {
class Search extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      searchTerm: '',
      expandSearch: false
    }
  }

  componentDidMount(){
    console.log("Search.js")
  }

  clearSearch = () => {
    this.setState({searchTerm: ''})
    if(this.state.expandSearch == false){
      this.setState({expandSearch: true})
    }
  }

  searchUpdated = (term) => {
    this.setState({searchTerm: term.target.value})
  }

  render() {
    return (
      <div className="input-group searchbar">
        <input className={"input-field search-field " + (this.state.expandSearch && "expand-search")} type="search" placeholder="Search patients" onChange={this.props.searchUpdated}/>
        <div className="input-group-button">
          <button className="button search">
            <svg onClick={this.props.clearSearch} className="icon"><use xlinkHref="#icon-search"></use></svg>
          </button>
        </div>
      </div>
    )
  }

}


export default Search;

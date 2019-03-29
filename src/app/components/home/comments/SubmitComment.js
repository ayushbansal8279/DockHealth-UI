import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import ButtonBase from '@material-ui/core/ButtonBase';

const StyledTextField = styled(TextField).attrs({ variant: 'outlined' })`
  && {
    width: 100%;
    height: 30px;
    border-radius: 4px;

    background: rgb(244, 244, 246);
  }

  && input {
    border: none;
    box-shadow: none;
    background: none;
    /* autocomplete */
    height: 28px;
    padding: 0 0 0 14px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    font-size: 14px;
    color: #2e3a43;
  }
  
  && fieldset {
    border: none;
    top: 0;
  }
`;

const StyledAdornment = styled(InputAdornment)`
  && {
    background: #d9036b;
    height: 100%;
    width: 34px;
    justify-content: center;
    color: #fff;
  }
`;

const StyledButton = styled(ButtonBase)`
  && {
    width: 100%;
    height: 100%;
  }
`;

class SubmitComment extends React.Component {
  state = {
    draft: '',
  }

  handleChange = (e) => {
    const { value: draft } = e.target;
    this.setState({ draft });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { submit } = this.props;
    const { draft } = this.state;
    if (draft === '') { return; }

    submit(draft);
    this.setState({ draft: '' });
  }

  render() {
    const { draft } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <StyledTextField
          onChange={this.handleChange}
          value={draft}
          placeholder="+ Add a comment"
          InputProps={{
            endAdornment: (
              <StyledAdornment position="end">
                <StyledButton onClick={this.handleSubmit}>
                  <AddIcon />
                </StyledButton>
              </StyledAdornment>
            ),
            style: {
              padding: 0,
            },
          }}
        >
      + Add Comment
        </StyledTextField>
      </form>
    );
  }
}

SubmitComment.propTypes = {
  submit: PropTypes.func.isRequired,
};

export default SubmitComment;

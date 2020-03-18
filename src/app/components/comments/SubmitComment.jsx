import { ButtonBase, InputAdornment, TextField } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

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
    padding: 0 14px;
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
    border-radius: 1px;
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
  };

  handleChange = event => {
    const { value: draft } = event.target;
    this.setState({ draft });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { submit } = this.props;
    const { draft } = this.state;
    if (draft === '') {
      return;
    }

    submit(draft);
    this.setState({ draft: '' });
  };

  render() {
    const { disabled } = this.props;
    const { draft } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <StyledTextField
          onChange={this.handleChange}
          value={draft}
          disabled={disabled}
          placeholder="+ Add a comment"
          InputProps={{
            endAdornment: (
              <StyledAdornment position="end">
                <StyledButton onClick={this.handleSubmit} disabled={disabled}>
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
  disabled: PropTypes.bool,
};

SubmitComment.defaultProps = {
  disabled: false,
};

export default SubmitComment;

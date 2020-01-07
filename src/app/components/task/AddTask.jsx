import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddIcon from '@material-ui/icons/Add';
import Toolbar from '@material-ui/core/Toolbar';
import { saveTask } from '../../actions/task-actions';

const StyledToolbar = styled(Toolbar).attrs({
  disableGutters: true,
})``;

const StyledForm = styled.form`
  width: 100%;
`;

const StyledTextField = styled(TextField).attrs({ variant: 'outlined' })`
  && {
    background: #e6ecf0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    height: 40px;
    width: 100%;
  }

  && input {
    height: 100%;
    border: none;
    box-shadow: none;
    background: none;
    font-size: 14px;
    color: #303538;
    padding: 0;

    ::placeholder {
      color: #303538;
      opacity: 1;
    }

    :focus::placeholder {
      opacity: 0.5;
    }
  }

  && fieldset {
    border: none;
    top: 0;
  }
`;

const StyledAdornment = styled(InputAdornment)`
  && {
    flex-shrink: 0;
    border-radius: 1px;
    height: 100%;
    max-height: 100%;
    width: 40px;
    justify-content: center;
  }
`;

const StyledAddIcon = styled(AddIcon)`
  && {
    color: #d9036b;
    width: 40px;
    height: 40px;
    padding: 5px;
  }
`;

const StyledAddIconRight = styled(StyledAddIcon)`
  && {
    color: #fff;
    background: #d9036b;
  }
`;

const StyledButton = styled(ButtonBase)`
  && {
    width: 100%;
    height: 100%;
  }
`;

const AddTask = ({ storeAsCurrentTask, submit, submitBound, style }) => {
  const [draft, setDraft] = useState('');

  const onSubmit = submitBound ?? submit;

  const handleChange = useCallback(
    event => {
      setDraft(event.target.value);
    },
    [setDraft],
  );

  const onFocus = useCallback(() => {
    storeAsCurrentTask(null);
  }, [storeAsCurrentTask]);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();

      if (draft === '') {
        return;
      }

      onSubmit(draft);
      setDraft('');
    },
    [draft, onSubmit],
  );

  return (
    <StyledToolbar style={style}>
      <StyledForm onSubmit={handleSubmit}>
        <StyledTextField
          onFocus={onFocus}
          onChange={handleChange}
          value={draft}
          placeholder="Add a task"
          InputProps={{
            startAdornment: (
              <StyledAdornment disablePointerEvents>
                <StyledAddIcon />
              </StyledAdornment>
            ),
            endAdornment: (
              <StyledAdornment>
                <StyledButton onClick={handleSubmit}>
                  <StyledAddIconRight />
                </StyledButton>
              </StyledAdornment>
            ),
            style: {
              padding: 0,
            },
          }}
        />
      </StyledForm>
    </StyledToolbar>
  );
};

AddTask.propTypes = {
  submit: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, { taskListId }) => ({
  submit: description => {
    saveTask({ description, taskListId })(dispatch);
  },
});

const ConnectedAddTask = connect(
  undefined,
  mapDispatchToProps,
)(AddTask);

ConnectedAddTask.propTypes = {
  taskListId: PropTypes.number.isRequired,
};

export default ConnectedAddTask;

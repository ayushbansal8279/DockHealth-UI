import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { saveTask } from '../../actions/task-actions';
import AdornedButton from '../common/AdornedButton';

const StyledToolbar = styled(Toolbar).attrs({
  disableGutters: true,
})``;

const StyledForm = styled.form`
  width: 100%;
`;

const StyledTextField = styled(TextField).attrs({ variant: 'outlined' })`
  && {
    background: #f3f5f6;
    border-radius: 0.25rem;
    height: 3.125rem;
    width: 100%;
  }

  && > div {
    padding-right: 0.1875rem;
  }

  && input {
    color: #8492a4;
    height: 3.125rem;
    border: none;
    box-shadow: none;
    background: none;
    font-size: 1.25rem;
    padding: 0 1rem;

    ::placeholder {
      color: #8492a4;
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
            endAdornment: (
              <AdornedButton onClick={handleSubmit} adornment={<AddIcon />}>
                ADD A TASK
              </AdornedButton>
            ),
            style: {},
          }}
        />
      </StyledForm>
    </StyledToolbar>
  );
};

AddTask.propTypes = {
  submit: PropTypes.func.isRequired,
};

const mapDispatchToProps = (
  dispatch,
  { taskListIdentifier, patientIdentifier },
) => ({
  submit: description => {
    if (patientIdentifier !== '') {
      saveTask({ description, taskListIdentifier, patientIdentifier })(
        dispatch,
      );
    } else {
      saveTask({ description, taskListIdentifier })(dispatch);
    }
  },
});

const ConnectedAddTask = connect(undefined, mapDispatchToProps)(AddTask);

ConnectedAddTask.propTypes = {
  taskListIdentifier: PropTypes.string.isRequired,
};

export default ConnectedAddTask;

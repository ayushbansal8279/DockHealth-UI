import React from 'react';
import { reduxForm } from 'redux-form';

const AddSubtaskField = ({ setCurrentSubtask, subtask, index }) => {
  return (
    <div
      onClick={() => setCurrentSubtask(subtask, index)}
      className="column large-12 input-group toggle-add-subtask has-value"
    >
      <span className="input-group-label">
        <svg className="icon">
          <use xlinkHref="#icon-subtask" />
        </svg>
      </span>
      <div className="input-wrapper form-floating-label">
        <input
          className="input-group-field"
          type="text"
          value={subtask.description}
        />
        <label>
          <>Subtask #</>
          {index + 1}
        </label>
      </div>
    </div>
  );
};

export default reduxForm({
  form: 'addSubtaskField',
  enableReinitialize: true,
})(AddSubtaskField);

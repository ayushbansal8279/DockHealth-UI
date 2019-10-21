import React from 'react';
import ReactSelect, { components } from 'react-select';

const Input = props => (
  <components.Input {...props} type="search" /> // Prevent jQuery hook from messing with labels
);

const theme = provided => ({
  ...provided,
  colors: {
    ...provided.colors,
    primary: 'rgb(177, 218, 232)',
    primary25: 'rgb(177, 218, 232)',
    primary50: 'rgb(177, 218, 232)',
  },
});

const styles = {
  container: provided => ({
    ...provided,
    margin: 0,
    outline: 'none',
  }),
  control: provided => ({
    ...provided,
    height: 60,
    borderLeft: 0,
    borderRadius: 0,
    borderColor: '#ededf0',
    '&:hover': { borderColor: '#ededf0' },
    boxShadow: 'none',
  }),
  valueContainer: provided => ({
    ...provided,
    margin: '1rem 1.5rem 0 0',
    padding: 0,
  }),
  singleValue: provided => ({
    ...provided,
    margin: 0,
  }),
  input: provided => ({
    ...provided,
    margin: 0,
    opacity: '1 !important',
  }),
  menu: provided => ({
    ...provided,
    margin: 0,
    boxShadow: 'none',
    borderLeft: '1px solid #ededf0',
    borderRight: '1px solid #ededf0',
    background: 'rgb(250, 250, 250)',
  }),
  menuList: provided => ({
    ...provided,
    padding: 0,
  }),
  option: provided => ({
    ...provided,
    paddingLeft: '3rem',
    borderBottom: '1px solid #ededf0',
    color: 'inherit',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
  }),
  noOptionsMessage: provided => ({
    ...provided,
    paddingLeft: '3rem',
    borderBottom: '1px solid #ededf0',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
  }),
};

class SelectInput extends React.Component {
  state = {
    isFocused: false,
  };

  containerRef = React.createRef();

  render() {
    const {
      input,
      label,
      options,
      id,
      disabled,
      xlinkHref,
      extraClassName,
      decoratingClassName,
      bufferClassName,
      meta: { touched, error },
    } = this.props;
    const { isFocused } = this.state;

    return (
      <div
        className={`input-group-wrapper column large-12 ${
          xlinkHref && touched && error ? 'has-error ' : ' '
        }${bufferClassName ? ` ${bufferClassName}` : ''}`}
      >
        <div
          className={`input-group ${
            xlinkHref ? '' : 'no-icon '
          }${decoratingClassName || ''}`}
          style={{ height: 60 }}
          ref={this.containerRef}
        >
          {xlinkHref && (
            <span className="input-group-label">
              <svg className="icon">
                <use xlinkHref={xlinkHref} />
              </svg>
            </span>
          )}
          <div
            className={
              input.value || isFocused
                ? `input-wrapper form-floating-label has-value ${!xlinkHref &&
                    touched &&
                    error &&
                    'has-error'}`
                : `input-wrapper form-floating-label ${!xlinkHref &&
                    touched &&
                    error &&
                    'has-error'}`
            }
          >
            <ReactSelect
              options={options}
              value={options.find(option => option.value === input.value)}
              onChange={input.onChange}
              onFocus={() => this.setState({ isFocused: true })}
              onBlur={() => this.setState({ isFocused: false })}
              id={id}
              className={
                extraClassName
                  ? `input-group-field ${extraClassName}`
                  : 'input-group-field'
              }
              disabled={disabled}
              placeholder=""
              noOptionsMessage={() => 'No Matches'}
              isClearable
              components={{ Input }}
              menuPortalTarget={this.containerRef.current}
              theme={theme}
              styles={{
                ...styles,
                menuPortal: provided => {
                  const rect = this.containerRef.current.getBoundingClientRect();
                  return {
                    ...provided,
                    zIndex: 201,
                    width: rect.width,
                    left: 'none',
                  };
                },
              }}
            />
            <label htmlFor={input.name}>{label}</label>
            {!xlinkHref && touched && error && (
              <span className="form-error">{error}</span>
            )}
          </div>
        </div>
        {xlinkHref && touched && error && (
          <span className="form-error">{error}</span>
        )}
      </div>
    );
  }
}

export default SelectInput;

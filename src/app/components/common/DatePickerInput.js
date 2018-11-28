import React from 'react'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class DatePickerInput extends React.Component {
  handleChange = (val) => {
    this.props.input.onChange(val)
  }
  
  render () {
    const { input, label, id, dateFormat, disabled, xlinkHref, extraClassName, decoratingClassName, bufferClassName, meta: { touched, error } } = this.props;

    return (
      <div className={"input-group-wrapper column large-12 " + (xlinkHref && touched && error ? 'has-error ' : ' ') + (bufferClassName ? (" " + bufferClassName) : '')}>
        <div className={'input-group ' + (xlinkHref ? '' : 'no-icon ') + (decoratingClassName? decoratingClassName : '')}>
          {xlinkHref &&
            <span className="input-group-label"><svg className="icon"><use xlinkHref={xlinkHref}></use></svg></span>
          }

          <div className={input.value ?
            'input-wrapper form-floating-label has-value ' + (!xlinkHref && touched && error && 'has-error') :
            'input-wrapper form-floating-label ' + (!xlinkHref && touched && error && 'has-error')}>

            <DatePicker 
              onChange={input.onChange}
              id={id}
              className={extraClassName ? "input-group-field " + extraClassName : "input-group-field"} 
              type='text'
              disabled={disabled}
              selected={input.value}
              showTimeSelect
              timeFormat="H:mm"
              timeIntervals={30}
              dateFormat={dateFormat}
              timeCaption="time"
              onChange={this.handleChange}
            />
            <label htmlFor={input.name}>{label}</label>

            {!xlinkHref && touched && error &&
              <span className="form-error">
                {error}
              </span>
            }
          </div>

        </div>
        {xlinkHref && touched && error &&
          <span className="form-error">
            {error}
          </span>
        }
      </div>
    )
  }
}

export default DatePickerInput

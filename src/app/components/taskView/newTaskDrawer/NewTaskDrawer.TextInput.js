/* eslint-disable react/jsx-no-duplicate-props */
import { any, bool, func, objectOf, string } from 'prop-types';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';

import styles from './NewTaskDrawer.TextInput.Styled';

const TextInput = React.forwardRef(
  (
    {
      label,
      placeholder,
      name,
      required,
      className,
      onFocus,
      onBlur,
      InputLabelProps,
      inputProps,
      InputProps,
      parentType,
      multiple,
      ...props
    },
    reference,
  ) => {
    const { errors, register } = useFormContext();
    const { classes } = props;

    const inputClass =
      parentType === 'select' ? classes.inputSelect : classes.input;
    const error = (errors[name] || {}).message;
    const hasError = Boolean(error);

    return (
      <>
        <TextField
          ref={reference}
          name={name}
          placeholder={placeholder}
          className={[
            parentType === 'select' ? classes.rootSelect : classes.root,
            className,
            hasError ? classes.error : '',
          ].join(' ')}
          // style={{borderBottomColor: hasError?'#ff0000':'#c1ccda'}}
          label={
            <>
              <span>{label?.toUpperCase()}</span>
              {required && (
                <>
                  <Spacing horizontal={3} />
                  <span>(required)</span>
                </>
              )}
            </>
          }
          multiline={!!multiple}
          InputProps={{
            margin: 'dense',
            disableUnderline: true,
            classes: {
              input: multiple ? classes.inputMultiple : inputClass,
            },
            ...InputProps,
          }}
          fullWidth
          // InputLabelProps={{
          //   shrink: true,
          // }}
          InputLabelProps={InputLabelProps}
          onFocus={onFocus}
          onBlur={onBlur}
          inputProps={inputProps}
          inputRef={parentType !== 'text' ? null : register}
        />
        <span className={classes.errorMessage}>{error}</span>
      </>
    );
  },
);

TextInput.propTypes = {
  label: string.isRequired,
  name: string.isRequired,
  placeholder: string,
  className: string,
  required: bool,
  multiple: bool,
  parentType: string,
  onFocus: func,
  onBlur: func,
  inputProps: objectOf(any),
  InputProps: objectOf(any),
};

TextInput.defaultProps = {
  placeholder: '',
  className: '',
  required: false,
  multiple: false,
  parentType: 'text',
  onFocus: () => {},
  onBlur: () => {},
  inputProps: {},
  InputProps: {},
};

export default withStyles(styles)(TextInput);

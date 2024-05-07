import React from 'react';
import { AddSubtaskInputWrapper, ErrorLabel } from './styled';

const QuickAddTaskInputWrapper = (props) => {
  const { hasInputValue, isFocused, error, placeholder, children } = props;

  return (
    <AddSubtaskInputWrapper
      placeholder={placeholder}
      isFocused={isFocused}
      hidePlaceholder={hasInputValue}
      hasError={error}
    >
      {children}
      {error && <ErrorLabel>{error}</ErrorLabel>}
    </AddSubtaskInputWrapper>
  );
};

export default QuickAddTaskInputWrapper;

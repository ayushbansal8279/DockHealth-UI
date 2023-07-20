import React from 'react';
import Spacing from 'components/common/Spacing';
import { AddSubtaskInputWrapper, ErrorLabel, QuickAddHint } from './styled';

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
      {/* {hasInputValue && isFocused && !error && (
        <>
          <Spacing horizontal={4} />
          <QuickAddHint>Hit enter to save</QuickAddHint>
        </>
      )} */}
      {error && <ErrorLabel>{error}</ErrorLabel>}
    </AddSubtaskInputWrapper>
  );
};

export default QuickAddTaskInputWrapper;

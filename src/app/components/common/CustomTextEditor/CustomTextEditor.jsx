import React from 'react';
import Spacing from 'components/common/Spacing';
import { getCompletedByLabel } from './helpers';
import {
  TextEditorFormStyleContainer,
  TextEditorInputLabel,
  DescriptionLabel,
  ErrorMessage,
} from './styled';

const CustomTextEditor = React.forwardRef(
  (
    {
      required,
      children,
      empty,
      focused,
      label,
      richTextEnabled = false,
      hasError,
      errorMessage,
      isSelectedTaskComplete = false,
      selectedTask,
    },
    reference,
  ) => {
    const shouldShrinkLabel = label && !empty && !focused;
    return (
      <TextEditorFormStyleContainer focused={focused} ref={reference}>
        <TextEditorInputLabel
          richTextEnabled={richTextEnabled}
          focused={focused}
          shrink={!empty}
          hasError={hasError}
          shouldShrinkLabel={shouldShrinkLabel}
        >
          <>
            <DescriptionLabel shouldShrinkLabel={shouldShrinkLabel}>
              {label}
              <Spacing horizontal={3} />
              {required && <span>*</span>}
            </DescriptionLabel>
            {isSelectedTaskComplete &&
              getCompletedByLabel(
                selectedTask.completedBy,
                selectedTask.completedDt,
              )}
          </>
        </TextEditorInputLabel>
        <div>{children}</div>
        {hasError && errorMessage && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}
      </TextEditorFormStyleContainer>
    );
  },
);

export default CustomTextEditor;

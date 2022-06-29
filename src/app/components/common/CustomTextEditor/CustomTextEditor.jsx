import React from 'react';
import Spacing from 'components/common/Spacing';
import { getCompletedByLabel } from './helpers';
import {
  TextEditorFormStyleContainer,
  TextEditorInputLabel,
  DescriptionLabel,
} from './styled';

const CustomTextEditor = ({
  required,
  children,
  empty,
  focused,
  label,
  richTextEnabled = false,
  hasError,
  isSelectedTaskComplete = false,
  selectedTask,
}) => {
  return (
    <TextEditorFormStyleContainer focused={focused}>
      <TextEditorInputLabel
        richTextEnabled={richTextEnabled}
        focused={focused}
        shrink={!empty}
        hasError={hasError}
      >
        <>
          <DescriptionLabel>
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
    </TextEditorFormStyleContainer>
  );
};

export default CustomTextEditor;

import React from 'react';
import Spacing from 'components/common/Spacing';
import {
  TextEditorFormStyleContainer,
  TextEditorInputLabel,
  DescriptionLabel,
} from '../TaskDrawer/styled';
import { getCompletedByLabel } from '../TaskDrawer/helpers';

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

import React from 'react';
import {
  TextEditorFormStyleContainer,
  TextEditorInputLabel,
} from '../TaskDrawer/styled';

const CustomTextEditor = ({
  children,
  empty,
  focused,
  label,
  richTextEnabled,
  hasError,
}) => {
  return (
    <TextEditorFormStyleContainer focused={focused}>
      <TextEditorInputLabel
        richTextEnabled={richTextEnabled}
        focused={focused}
        shrink={!empty}
        hasError={hasError}
      >
        {label}
      </TextEditorInputLabel>
      <div>{children}</div>
    </TextEditorFormStyleContainer>
  );
};

export default CustomTextEditor;

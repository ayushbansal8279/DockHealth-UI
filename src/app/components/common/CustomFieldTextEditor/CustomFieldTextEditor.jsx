import React from 'react';
import Spacing from 'components/common/Spacing';
import {
  TextEditorFormStyleContainer,
  TextEditorInputLabel,
  DescriptionLabel,
  ErrorMessage,
} from './styled';

const CustomFieldTextEditor = React.forwardRef(
  (
    { required, children, empty, focused, label, hasError, errorMessage },
    reference,
  ) => {
    const shouldExpandLabel = label && empty && !focused;
    return (
      <TextEditorFormStyleContainer focused={focused} ref={reference}>
        <TextEditorInputLabel
          hasError={hasError}
          shouldExpandLabel={shouldExpandLabel}
        >
          <>
            <DescriptionLabel shouldExpandLabel={shouldExpandLabel}>
              {label}
              <Spacing horizontal={3} />
              {required && <span>*</span>}
            </DescriptionLabel>
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

export default CustomFieldTextEditor;

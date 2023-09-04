import React from 'react';
import TextEditor from '../TextEditor/TextEditor';
import * as St from './styled';

export default function Input(props) {
  return (
    <St.RootContainer>
      <TextEditor type="input" {...props} />
    </St.RootContainer>
  );
}

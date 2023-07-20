import React from 'react';
import TextEditor from '../TextEditor/TextEditor';
import { Container } from './styled';

export default function Input(props) {
  return (
    <Container>
      <TextEditor type="input" {...props} />
    </Container>
  );
}

import React from 'react';
import TextEditor from '../TextEditor/TextEditor';
import { Container } from './styled';

export default function TextArea(props) {
  return (
    <Container>
      <TextEditor type="textarea" {...props} />
    </Container>
  );
}

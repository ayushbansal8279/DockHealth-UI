import React from 'react';
import TextEditor from '../TextEditor/TextEditor';
import * as S from './styled';

export default function TextArea(props) {
  return (
    <S.Container>
      <TextEditor type="textarea" {...props} />
    </S.Container>
  );
}

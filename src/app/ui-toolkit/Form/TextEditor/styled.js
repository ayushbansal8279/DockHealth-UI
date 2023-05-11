import { styled } from '@mui/material/styles';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import Box from '../../Primitive/Box/Box';

export const Container = styled(Box)`
  position: relative;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 15px;
  width: 100%;
  min-height: ${(props) => (props.type === 'textarea' ? '75px' : '100%')};
  padding-bottom: ${(props) => (props.type === 'textarea' ? '5px' : '0')};
`;

export const Content = styled(Box)`
  position: relative;
`;

export const Input = styled(ContentEditable)`
  font: inherit;
  outline: none;

  p {
    margin-bottom: 0;
  }
  
  ul li {
    list-style: disc;
  }

  ol li {
    list-style: decimal;
  }
`;

export const Placeholder = styled(Box)`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  font: inherit;
  color: rgb(132, 146, 164);
`;

export const Avatar = styled(Box)`
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
  max-width: 32px;
  max-height: 32px;
  min-width: 32px;
  min-height: 32px;
  margin: 4px;
  color: white;
  background-color: ${({ $color }) => $color};
  border: 1px solid white;
  outline: 1px solid ${({ $color }) => $color};
  border-radius: 100%;

  img {
    border-radius: 100%;
  }
`;

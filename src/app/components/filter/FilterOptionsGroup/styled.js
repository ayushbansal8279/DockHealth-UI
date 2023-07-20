import styled from 'styled-components';
import palette from 'styles/palette';

export const OptionsGroup = styled.div`
  :not(:first-of-type) {
    padding-top: 8px;
  }

  :not(:last-of-type) {
    padding-bottom: 8px;
    border-bottom: 1px solid ${palette.blueGrey};
  }
`;

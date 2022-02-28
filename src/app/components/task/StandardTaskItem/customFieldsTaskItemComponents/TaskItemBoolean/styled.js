import styled from 'styled-components';
import Select from 'components/common/Select/Select';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const BooleanBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  cursor: pointer;
  position: relative;
`;

export const PlaceholderContainer = styled.div`
  top: -3px;
  position: absolute;
  left: 0px;
  z-index: 9;
  pointer-events: none;
`;

export const BooleanSelect = styled(Select)`
  && {
    & .MuiSelect-root {
      padding: 0px;
      background: white;
    }
    & .MuiSelect-root:before {
      display: none;
    }
  }
`;

export const AddPlaceholder = styled.div`
  color: ${palette.lightGrey};
  opacity: 0;
  &::first-letter {
    color: ${palette.orange};
    font-size: ${fontSizes.regular};
  }

  &:hover {
    color: ${palette.brightBlue};
  }
`;

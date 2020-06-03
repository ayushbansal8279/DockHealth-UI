import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const DatepickerOptionLabelContainer = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  color: ${palette.darkGrey};
  cursor: pointer;

  ${props => props.isSelected && `&& > * { font-weight: ${fontWeights.bold}; }`}

  &:disabled {
    cursor: initial;
  }

  &:hover:not(:disabled) {
    background-color: ${palette.coolGrey4};

    && > * {
      font-weight: ${fontWeights.bold};
    }
  }
`;

export const StyledPopover = styled.div`
  min-width: 293px;
  border: none;
  box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.17);
  background: ${palette.white};
`;

export const Backdrop = styled.button`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 2000;
  appearance: none;
`;

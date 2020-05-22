import styled from 'styled-components';
import palette from 'styles/palette';
import { Chip } from '@material-ui/core';
import { CheckCircleOutline } from '@material-ui/icons';

export const GlobalChipWrapper = styled.div`
  position: fixed;
  top: 6.5rem;
  left: 50%;
  z-index: 1000;
  width: auto;
  height: auto;
  transform: translateY(-50%);
`;

export const ChipContainer = styled.button`
  position: absolute;
  height: ${props => (props.isOpen ? '2rem' : '0')};
  overflow: hidden;
  transition: height 0.25s ease-out;
`;

export const StyledChip = styled(Chip)`
  && {
    background-color: ${palette.accentYellow};
    color: ${palette.white};
    border: 0;
    font-weight: bold;
    font-size: 16px;
    padding: 0 0.25rem;
    transition: top 0.25s ease-out;
    transform: translateX(0%);
    text-transform: uppercase;
  }
`;

export const CheckCircleIcon = styled(CheckCircleOutline)`
  && {
    color: ${palette.white};
  }
`;

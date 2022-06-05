import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  display: inline-block;
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
`;

export const ViewTypeButtonsWrapper = styled.div`
  display: flex;
  @media print {
    display: none;
  }
`;

export const ViewTypeButton = styled.button`
  margin-left: ${spacing.regularPlus};
  color: ${({ active }) => (active ? palette.brightBlue : palette.coolGrey2)};
  cursor: ${props => (props.isHidden ? 'initial' : 'pointer')};
  transition: color 0.3s ease-out;
`;

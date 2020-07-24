import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const PopperTopArrow = styled.div`
  position: absolute;
  top: -2px;
  width: 20px;
  height: 22px;
  border-bottom: 22px solid ${palette.darkBlue};
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
`;

export const PopperBottomArrow = styled(PopperTopArrow)`
  top: auto;
  bottom: -2px;
  transform: rotate(-180deg);
`;

export const PopperLeftArrow = styled(PopperTopArrow)`
  top: auto;
  bottom: auto;
  left: -2px;
  transform: rotate(-90deg);
`;

export const PopperWrapper = styled.div`
  margin: ${spacing.regular};
  background: ${palette.darkBlue};
  border-radius: 5px;
`;

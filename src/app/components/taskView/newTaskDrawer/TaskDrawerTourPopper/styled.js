import styled from 'styled-components';
import palette from 'styles/palette';

export const PopperTopArrow = styled.div`
  position: absolute;
  top: -10px;
  width: 20px;
  height: 22px;
  border-bottom: 22px solid ${palette.darkBlue};
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
`;

export const PopperBottomArrow = styled(PopperTopArrow)`
  top: auto;
  bottom: -10px;
  transform: rotate(-180deg);
`;

export const PopperWrapper = styled.div`
  margin-top: 8px;
  background: ${palette.darkBlue};
  border-radius: 5px;
`;

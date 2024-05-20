import { fontWeights } from '@/app/styles/font';
import palette from '@/app/styles/palette';
import styled from 'styled-components';

export const HidableContainer = styled.div`
  visibility: ${(props) => (props.visible ? 'hidden' : 'visible')};
  max-height: ${(props) => (props.visible ? '0px' : '500px')};
  opacity: ${(props) => (props.visible ? 0 : 1)};
  transition: all 250ms ease-out;
`;

export const SaveButton = styled.button`
  display: flex;
  height: 40px;
  padding: 22px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background-color: ${palette.oPlusRed};
  color: ${palette.white};
  text-align: center;
  font-family: Outfit;
  font-style: normal;
  font-size: 14px;
  font-weight: ${fontWeights.regular};
  line-height: 11.189px;
  text-transform: none;
  width: 200px;

  &:hover {
    background-color: ${palette.oPlusRed};
    color: ${palette.white};
  }
`;

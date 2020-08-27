import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
`;

export const InviteInitialViewWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const InviteInitialViewContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const NavigationActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 222px;
  height: 224px;
  border: 1px solid ${palette.coolGrey1};
  transition: background 0.3s ease-out;

  &:hover {
    background: ${palette.coolGrey4};
    cursor: pointer;
  }
`;

export const NavigationIcon = styled.img`
  display: block;
  height: 46px;
`;

export const NavigationText = styled.p`
  margin-bottom: 0;
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.regular};
  font-family: 'Roboto Condensed', sans-serif;
`;

export const SkipButton = styled.button`
  margin: 0 auto;
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.bold};
  color: ${palette.darkBlue};
  cursor: pointer;
  text-decoration: underline;
  text-transform: uppercase;
`;

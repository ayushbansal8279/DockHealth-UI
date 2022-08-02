import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const TrialBannerContainer = styled.div`
  transition: all 0.2s ease-out;
  align-items: center;
  background-color: ${palette.oPlusRed};
  color: ${palette.white};
  display: flex;
  height: ${props => (props.isBannerVisible ? '2.875rem' : 0)};
  ${props => (!props.uppercase ? 'text-transform: none;' : '')}
  justify-content: center;
  width: 100%;
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
  overflow: hidden;
`;

export const TrialBannerLink = styled(Link)`
  color: ${palette.white};
  margin-left: 0.25rem;
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: ${palette.coolGrey3};
  }
`;

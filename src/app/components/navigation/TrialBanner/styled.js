import styled from 'styled-components';
import { Link } from 'react-router-dom';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const TrialBannerContainer = styled.div`
  transition: all 0.2s ease-out;
  align-items: center;
  background-color: ${(props) =>
    props.isCancelBanner ? '#FFFBEB' : palette.oPlusRed};
  color: ${(props) => (props.isCancelBanner ? palette.black : palette.white)};
  display: flex;
  height: ${(props) => (props.isBannerVisible ? '2.875rem' : 0)};
  ${(props) => (props.uppercase ? '' : 'text-transform: none;')}
  justify-content: ${(props) =>
    props.isCancelBanner ? 'flex-start' : 'center'};
  width: 100%;
  font-family: 'Outfit', sans-serif;

  font-size: ${(props) =>
    props.isCancelBanner ? fontSizes.smallPlus : fontSizes.regular};
  font-weight: ${(props) =>
    props.isCancelBanner ? fontWeights.light : fontWeights.bold};
  text-transform: ${(props) => (props.isCancelBanner ? 'none' : 'uppercase')};
  overflow: hidden;
  padding: ${(props) => (props.isCancelBanner ? '0 1rem' : '0')};
  border-bottom: ${(props) =>
    props.isCancelBanner ? '1px solid #FFD230' : 'none'};
`;

export const CancelBannerIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
`;

export const CancelBannerContent = styled.div`
  display: flex;
  align-items: center;
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

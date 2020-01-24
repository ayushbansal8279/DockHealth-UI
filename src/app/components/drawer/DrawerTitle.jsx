import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

const TitleContainer = styled.div`
  align-items: center;
  background-color: ${props => props.backgroundColor ?? '#007cab'};
  color: #000;
  display: flex;
  flex-flow: row wrap;
  height: ${props => (props.trialBannerVisible ? 8.375 : 5.5)}rem;
  left: 100%;
  position: absolute;
  transition: top 0.2s ease-out;
  top: ${({ open, trialBannerVisible }) => {
    let top = 0;

    if (!open) {
      top -= 88;

      if (trialBannerVisible) {
        top -= 46;
      }
    }

    return top;
  }}px;
  width: calc(100vw - 100%);
  z-index: 1;
`;

const MainGrid = styled(Grid)`
  height: 5.5rem;
`;

const TrialBanner = styled(Grid)`
  background-color: #2a4a70;
  color: #fff;
  font-weight: bold;
  height: 2.875rem;
`;

const TrialBannerLink = styled(Link)`
  color: #fff;
  margin-left: 0.25rem;
  text-decoration: underline;
  transition: all 0.25s ease-out;

  &:hover {
    color: #eee;
  }
`;

const renderLayoutColumn = ({ key, component, ...otherProps }) => (
  <MainGrid item container key={key} {...otherProps}>
    {component}
  </MainGrid>
);

export default ({ header, trialBannerVisible, trialEndLabel }) => {
  const { show, backgroundColor, layout } = header;

  return (
    <TitleContainer
      backgroundColor={backgroundColor}
      open={show}
      trialBannerVisible={trialBannerVisible}
    >
      <MainGrid item xs={12} container>
        {layout.map(renderLayoutColumn)}
      </MainGrid>
      {trialBannerVisible && (
        <TrialBanner
          item
          xs={12}
          container
          justify="center"
          alignItems="center"
        >
          <span>{trialEndLabel}</span>
          <TrialBannerLink to="/subscriptions">Learn more</TrialBannerLink>
        </TrialBanner>
      )}
    </TitleContainer>
  );
};

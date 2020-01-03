import Grid from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';

const TitleContainer = styled.div`
  align-items: center;
  background-color: ${props => props.backgroundColor ?? '#007cab'};
  color: #000;
  display: flex;
  height: 88px;
  left: 100%;
  position: absolute;
  transition: top 0.2s ease-out;
  top: ${props => (props.open ? 0 : -88)}px;
  width: calc(100vw - 100%);
  z-index: 1;
`;

const MainGrid = styled(Grid)`
  height: 100%;
`;

const renderLayoutColumn = ({ key, component, ...otherProps }) => (
  <MainGrid item container key={key} {...otherProps}>
    {component}
  </MainGrid>
);

export default ({ header }) => {
  const { show, backgroundColor, layout } = header;

  return (
    <TitleContainer backgroundColor={backgroundColor} open={show}>
      <MainGrid container>{layout.map(renderLayoutColumn)}</MainGrid>
    </TitleContainer>
  );
};

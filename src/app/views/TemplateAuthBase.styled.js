import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';

export const BackgroundContainer = styled.div`
  align-items: center;
  background-image: url(/assets/img/bg.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
`;

export const BackgroundHorizontalFiller = styled.div`
  background-color: rgb(46, 58, 67, 0.7);
  flex: 260;
  width: 100%;
`;

export const BackgroundCenterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1127;
  width: 100%;
`;

export const BackgroundVerticalFiller = styled.div`
  background-color: rgb(46, 58, 67, 0.7);
  flex: 1;
  height: 100%;
`;

export const BackgroundModalContainer = styled(Grid)`
  max-width: 1312px;
  position: relative;
  &:before {
    padding-top: 50%;
  }
`;

export const BackgroundRectangleContainer = styled.div`
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
  z-index: -1;

  & img {
    max-width: 760px;
    height: 100%;
  }
`;

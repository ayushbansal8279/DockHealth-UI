import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import { Button } from '@material-ui/core';

export const Wrapper = styled.div`
  width: 100%;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
`;

export const Picture = styled.img`
  display: inline-block;
  width: 450px;
  vertical-align: top;
  margin: ${spacing.largePlus};
`;

export const TextWrapper = styled.div`
  display: inline-block;
  width: 500px;
  margin: ${spacing.largePlus};
  text-align: left;
`;

export const Title = styled.h3`
  font-size: ${fontSizes.largePlus};
  margin-bottom: ${spacing.largePlus};
`;

export const Description = styled.p`
  margin-bottom: 100px;
  padding-right: 50px;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const CreateListButton = styled(Button)`
  && {
    min-width: 245px;
  }
`;

export const TourButton = styled(Button)`
  && {
    min-width: 245px;
    text-transform: uppercase;
  }
`;

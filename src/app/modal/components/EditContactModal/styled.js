import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { withStyles } from '@material-ui/core/styles';
import { ButtonGroup } from '@material-ui/core';
import { ModalWrapper } from '../styled';

export const AdditionalOptionLabel = styled.span`
  cursor: pointer;
`;

export const AddPatientFieldModalWrapper = styled(ModalWrapper)`
  display: flex;
  flex-direction: column;
  width: 700px;
  min-height: 480px;
  padding: ${spacing.large} ${spacing.huge};
  font-family: 'Montserrat', sans-serif;
  color: ${palette.mediumGrey};
`;

export const Title = styled.p`
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  color: inherit;
  margin-bottom: 0;
`;

export const ButtonGroupFlexStyled = withStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    gap: '50px',
  },
})(ButtonGroup);

export const ContactStepFormStyled = styled.form`
  width: 100%;
`;

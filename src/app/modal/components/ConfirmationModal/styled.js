import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import { Button } from '@mui/material';

export const ConfirmationContainer = styled.div`
  width: 571px;
  padding: 42px 75px; // per design
  background-color: ${palette.white};
`;

export const Description = styled.p`
  margin-bottom: 0;
  text-align: center;
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regular};
  font-family: inherit;
`;

export const Image = styled.img`
  display: block;
  height: 64px;
  margin: 0 auto ${spacing.huge};
`;

export const ModalWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ width }) => width || '450px'};
  max-width: 100vw;
  font-family: inherit;
  background-color: white;
  padding-bottom: ${spacing.small};
  // padding-top: ${spacing.largePlus};
`;

export const ModalIconContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${palette.offBlack};
  text-align: center;
  font-family: Outfit;
  font-size: 18px;
  font-style: normal;
  font-weight: ${fontWeights.regularPlus};
  line-height: 20px;
  text-transform: capitalize;
  padding-top: 16px;
`;

export const ModalDescriptionContainer = styled.div`
  padding: ${spacing.regularPlus};
  align-self: stretch;
  color: ${palette.black};
  text-align: center;
  font-family: Outfit;
  font-size: 15px;
  font-style: normal;
  font-weight: 300;
  line-height: 25px; /* 156.25% */
`;

export const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: ${spacing.small} ${spacing.largePlus} ${spacing.largePlus};
`;

export const ConfirmButton = styled(Button)`
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
  font-weight: 500;
  line-height: 11.189px;
  text-transform: none;

  &:hover {
    background-color: ${palette.oPlusRed};
    color: ${palette.white};
  }
`;

export const CancelButton = styled(Button)`
  display: flex;
  height: 40px;
  padding: 22px ${spacing.large};
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid ${palette.oPlusRed};
  color: ${palette.oPlusRed};
  font-family: Outfit;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: 11.189px;
  text-transform: none;
`;

export const ModalCloseIcon = styled.img`
  display: block;
  height: 24px;
  cursor: default;
  margin: ${spacing.small};
  cursor: pointer;
`;

export const CloseIconContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
`;
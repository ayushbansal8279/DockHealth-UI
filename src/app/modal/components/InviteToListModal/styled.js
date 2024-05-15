import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import { ModalWrapper } from '../styled';

export const InviteToListModalWrapper = styled(ModalWrapper)`
  display: flex;
  flex-direction: column;
  width: 600px;
  padding: ${spacing.regularPlus} ${spacing.largePlus} ${spacing.largePlus};
`;

export const Header = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: ${spacing.large};
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  color: ${palette.coolGrey1};
`;

export const Title = styled.h5`
  font-size: ${fontSizes.regularPlus};
  text-align: center;
  font-weight: ${fontWeights.regularPlus};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  
`;

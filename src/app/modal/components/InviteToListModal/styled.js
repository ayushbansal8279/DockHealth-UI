import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
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
  margin-bottom: ${spacing.huge};
`;

export const Description = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  color: ${palette.coolGrey1};
`;

export const Title = styled.h5`
  font-size: ${fontSizes.regularPlus};
  color: ${palette.brightBlue};
  text-transform: uppercase;
  text-align: center;
`;

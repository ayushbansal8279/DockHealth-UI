import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';
import { ModalWrapper } from '../styled';

export const ListFormModalWrapper = styled(ModalWrapper)`
  display: flex;
  flex-direction: column;
  width: 600px;
  min-height: 500px;
  padding: ${spacing.regularPlus} ${spacing.largePlus};
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
  text-align: center;
  font-weight: ${fontWeights.regular};
`;

export const StepCounter = styled.div`
  width: 100%;
  text-align: center;
  margin-top: ${spacing.regularPlus};
`;

export const Step = styled.button`
  display: inline-block;
  height: 8px;
  width: 8px;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 4px;
  outline: none;
  ${({ isCurrent }) => (isCurrent ? `background: ${palette.coolGrey2};` : '')}
  ${({ isDisabled }) => (isDisabled ? '' : 'cursor: pointer;')}

  &:not(:last-child) {
    margin-right: ${spacing.tiny};
  }
`;

export const ButtonWrapper = styled.div`
  width: 220px;
`;

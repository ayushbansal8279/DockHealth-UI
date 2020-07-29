import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';
import spacing from 'styles/spacing';
import { ModalWrapperWithPadding } from '../styled';

export const CreateListModalWrapper = styled(ModalWrapperWithPadding)`
  display: flex;
  flex-direction: column;
  width: 530px;
  min-height: 537px;
  max-height: calc(100% - 50px);
  overflow-y: scroll;
`;

export const Header = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: ${spacing.huge};
`;

export const Description = styled.p`
  font-size: ${fontSizes.regular};
  color: ${palette.coolGrey1};
`;

export const Title = styled.h5`
  font-size: ${fontSizes.regularPlus};
  color: ${palette.brightBlue};
  text-transform: uppercase;
  text-align: center;
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
  ${({ isFilled }) => isFilled && `background: ${palette.coolGrey2};`}
  ${({ isDisabled }) => !isDisabled && 'cursor: pointer;'}

  &:not(:last-child) {
    margin-right: ${spacing.tiny};
  }
`;

export const ButtonsWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

export const FormWrapper = styled.form`
  display: flex;
  flex: 1;
  width: 100%;
`;

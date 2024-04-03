import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import { ModalWrapperWithPadding } from '../styled';

export const ImportPatientModalWrapper = styled(ModalWrapperWithPadding)`
  display: flex;
  flex-direction: column;
  width: 479px;
  height: 376px;
`;

export const Description = styled.p`
  font-size: ${fontSizes.smallPlus};
  color: ${palette.darkGrey};
  text-align: center;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;
`;

export const ContentMessage = styled.p`
  font-family: inherit;
  font-style: normal;
  font-weight: ${fontWeights.light};
  font-size: ${fontSizes.regular};
  line-height: 25px;
  text-align: center;
`;

export const Title = styled.h5`
  font-family: inherit;
  font-size: ${fontSizes.regular};
  color: ${palette.brightBlue};
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 25px;
`;

export const AlreadyHaveTemplate = styled.a`
  font-family: inherit;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  font-size: ${fontSizes.smallPlus};
  line-height: 130%;
  margin-top: 20px;
`;

export const FileInputArea = styled.div`
  background-color: ${palette.blueGrey};
  width: 348px;
  height: 142px;
  text-align: center;
  outline: none;
`;

export const FileInputMessage = styled.div`
  font-family: inherit;
  font-style: normal;
  font-weight: ${fontWeights.extraLight};
  font-size: ${fontSizes.regular};
  line-height: 19px;
  text-align: center;
  padding-bottom: 0.15rem;
`;

export const FileInputImage = styled.img`
  width: 31.97px;
  height: 41px;
  position: center;
  margin: 20px;
`;

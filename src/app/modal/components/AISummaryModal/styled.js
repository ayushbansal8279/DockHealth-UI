import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';
import palette from 'styles/palette';
import { ModalWrapper } from '../styled';
import { Button, TextareaAutosize } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import SelectDown from 'img/AI/SelectDown.svg';

export const AISummaryModalWrapper = styled(ModalWrapper)`
  width: 600px;
  border-radius: 10px;
  padding: ${spacing.regular} ${spacing.largePlus} 0 ${spacing.largePlus};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: space-between;
  width: 100%;
  margin-top: 5px;
`;

export const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: space-between;
  width: 100%;
  margin: 20px 0 10px 0;
`;

export const Title = styled.div`
  display: flex;
  gap: 10px;
  color: ${palette.gunmetal};
  font-size: 21px;
  font-weight: ${fontWeights.bold};
`;

export const CustomPromptInput = styled(TextareaAutosize)`
  background-color: ${palette.white};
  min-width: 435px;
  max-width: 435px;
  max-height: 150px;
  width: 435px;
  margin-top: 10px;
  line-height: 1.5;
  padding: 8px 15px;
  border-radius: 8px;

  &:hover {
    border-color: ${palette.brightBlue};
  }

  &:focus {
    border-color: ${palette.brightBlue};
  }

  &:disabled {
    background-color: ${palette.white};
  }
`;

export const IconWrapper = styled.img`
  cursor: pointer;
  width: 24px;
  height: 24px;
`;

export const GeneratedTime = styled.div`
  color: ${palette.gunmetal};
  font-size: 12px;
  font-weight: ${fontWeights.light};
  line-height: 150%;
`;
export const Info = styled.div`
  color: ${palette.gunmetal};
  font-size: 15px;
  font-style: normal;
  font-weight: ${fontWeights.light};
  line-height: normal;
  max-height: 450px;
  overflow: auto;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
  }

  &::-webkit-scrollbar:vertical {
    width: 11px;
  }

  &::-webkit-scrollbar-track {
    background-color: #fff;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${palette.white};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid ${palette.white};
    background-color: ${palette.coolGrey1};
  }
`;

export const ResponseButton = styled(Button)`
  color: ${palette.black};
  font-size: 16px;
  line-height: 135%;
  background-color: ${palette.whiteSmoke};

  &:hover {
    background-color: ${palette.whiteSmoke};
    color: ${palette.black};
  }

  &:disabled {
    color: ${palette.white};
    background-color: ${palette.shadowBlue};
  }
`;

export const PromptSelector = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0 40px 0 10px;
  border: 1px solid ${palette.lightGrey2};
  background-image: url(${SelectDown});
  background-repeat: no-repeat;
  background-position-x: 95%;
  background-position-y: 60%;
  border-radius: 6px;
  font-weight: 500;
  width: fit-content;
`;

export const RegenerateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
`;

export const RefreshWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 6px;
  background-color: ${palette.whiteSmoke};
  padding: 0 2px;
`;

export const AISummaryLoaderSkeleton = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      height: 15px;
      border-radius: 4px;
    }
  }
`;

export const CopyTooltip = styled.div`
  position: absolute;
  top: 40;
  right: 1;
  color: ${palette.coolGrey1};
  background-color: ${({ copied }) => (copied ? palette.mediumGrey : '')};
  padding: 2px 5px;
  border-radius: 6px;
`;

export const CustumTooltip = styled.div`
  padding: 3px 10px;
  position: absolute;
  top: 45;
  right: ${({ right }) => right || null};
  left: ${({ left }) => left || null};
  color: black;
  background-color: ${palette.whiteSmoke};
  font-size: 14px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-weight: 500;
`;

export const Footer = styled.p`
  margin-top: 15px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
  color: ${palette.offBlack};
`;

export const FeedbackLink = styled.a`
  color: ${palette.newBrightBlue};
  margin-left: 2px;
`;

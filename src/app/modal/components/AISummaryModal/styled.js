import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';
import palette from 'styles/palette';
import { ModalWrapper } from '../styled';
import { Button } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export const AISummaryModalWrapper = styled(ModalWrapper)`
  width: 600px;
  border-radius: 10px;
  padding: ${spacing.regularPlus} ${spacing.largePlus} ${spacing.largePlus};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: space-between;
  width: 100%;
`;

export const SubHeader = styled.div`
  display: flex;
  gap: 10px;
`;

export const Title = styled.div`
  color: ${palette.gunmetal};
  font-size: 21px;
  font-weight: ${fontWeights.bold};
`;

export const IconWrapper = styled.img`
  margin-left: 10px;
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

export const RegenerateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RefreshWrapper = styled.div`
  border-radius: 6px;
  background-color: ${palette.whiteSmoke};
  padding-left: 10px;
  display: flex;
  align-items: center;
`;

export const AISummaryLoaderSkeleton = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      height: 15px;
      border-radius: 4px;
    }
  }
`;

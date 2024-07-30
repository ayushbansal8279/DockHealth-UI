import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import { ModalWrapper } from '../styled';

export const PatientAISummaryModalWrapper = styled(ModalWrapper)`
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

export const PatientName = styled.div`
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
export const PatientInfo = styled.div`
  color: ${palette.gunmetal};
  font-size: 14px;
  font-style: normal;
  font-weight: ${fontWeights.light};
  line-height: normal;
`;

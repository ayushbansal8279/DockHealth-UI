import styled from 'styled-components';
import palette from 'styles/palette';

export const MeterBillingViewOuterContainer = styled.div`
  display: flex;
  min-height: 100%;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 24px;
  background-color: ${palette.white};
`;

export const MeterBillingViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem;
  width: 100%;
`;

export const MeterBillingSecondHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 0 0 20px 0;
  gap: 30px;
`;

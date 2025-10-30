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
  margin-bottom: 20px;
`;

export const MeterBillingSecondHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const StatsHeader = styled.div`
  margin-bottom: 16px;
  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
`;

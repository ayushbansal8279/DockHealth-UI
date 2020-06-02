import styled from 'styled-components';
import palette from 'styles/palette';

export const PersonNameLabelContainer = styled.div`
  color: ${palette.mediumGrey};
`;

export const AuditDetailsLabelContainer = styled.div`
  color: ${palette.mediumGrey};
`;

export const AuditTypeLabelContainer = styled.div`
  color: ${palette.coolGrey2};
`;

export const DateTimeLabelContainer = styled.div`
  color: ${palette.coolGrey2};
`;

export const SectionRow = styled.div`
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export const SectionLabel = styled.div`
  color: ${palette.unknownGrey5};
  flex: 2;
  font-size: 0.875rem;
  padding-right: 0.25rem;
`;

export const SectionButtonContainer = styled.div`
  flex: 5;
  font-size: 0.875rem;
`;

export const SectionButton = styled.span`
  color: ${props => props.color ?? palette.greyBlue};
  cursor: ${props => (props.clickable ? 'pointer' : 'defualt')};
  font-size: 0.875rem;
`;

export const HistoryLabel = styled(SectionButton)`
  cursor: default;
`;

export const HistorySublabel = styled(HistoryLabel)`
  color: ${palette.unknownGrey5};
  font-size: 0.75rem;
`;

export const HistoryItemContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin-bottom: 0.5rem;
`;

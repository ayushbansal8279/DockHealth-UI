import styled from 'styled-components';
import palette from 'styles/palette';

export const NonEmptyListTable = styled.div`
  color: ${palette.unknownGrey1};
  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 0.25rem;
  grid-template-columns: 1fr;
  margin: 2rem;
  ${props => props.highlightedPatientIdentifier && 'margin-right: 0.25rem;'}
`;

export const ListRow = styled.div`
  background: ${props =>
    props.isHighlighted ? palette.softCyan : palette.white};
  grid-template-columns: ${props =>
    props.isCompact ? '0.75fr 0.25fr' : `0.5fr 0.15fr 0.15fr 0.1fr 0.1fr`};
  display: grid;
  font-size: 1rem;
  height: 4rem;
  color: ${palette.mediumGrey};
  cursor: pointer;

  & > div {
    align-items: center;
    display: flex;
    padding-left: 1.75rem;
    overflow: hidden;

    &:first-child {
      padding-left: 2.75rem;
    }

    &:last-child {
      padding: 0 1rem;
    }
  }
`;

export const ListHeader = styled(ListRow)`
  cursor: default;
  font-size: 0.875rem;
  font-weight: 600;
  height: 2rem;
  position: sticky;
  text-transform: uppercase;
  top: 0;
  z-index: 1;
`;

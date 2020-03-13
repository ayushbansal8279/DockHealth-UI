import TableCell from '@material-ui/core/TableCell';
import styled from 'styled-components';

export const TaskListOuterContainer = styled.div`
  width: 100%;
`;

export const StyledTableCell = styled(TableCell)`
  && {
    border: none;
    padding-right: 0;
    padding-left: 0;

    :last-child {
      padding-right: 0;
    }
  }
`;

export const ShowMoreButtonContainer = styled.div`
  height: ${props => (props.active ? 2.25 : 0)}rem;
  overflow: hidden;
  position: relative;
  transition: height 0.25s ease-out;
  width: 100%;
`;

export const ShowMoreButton = styled.div`
  align-items: center;
  background-color: #d9036b;
  border-radius: 0 0 0.5rem 0.5rem;
  color: #fff;
  cursor: ${props => (props.active ? 'pointer' : 'not-allowed')};
  display: flex;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0 2rem;
  position: absolute;
  height: 2.25rem;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  top: ${props => (props.active ? 0 : -2.25)}rem;
  transition: top 0.25s ease-out;
`;

export const HeadingContainer = styled.div`
  align-items: center;
  background-color: white;
  display: flex;
  flex-direction: row;
  font-size: 0.875rem;
  font-weight: 600;
  height: 1.0625rem;
`;

export const HeadingLabelContainer = styled.div`
  cursor: pointer;
`;

export const HeadingAssignedToContainer = styled(HeadingLabelContainer)`
  margin-left: 2.75rem;
`;

export const HeadingTaskContainer = styled(HeadingLabelContainer)`
  flex: 1;
  margin-left: 0.75rem;
`;

export const HeadingPatientContainer = styled(HeadingLabelContainer)`
  margin-right: 0.625rem;
  width: 13rem;
`;

export const HeadingDueDateContainer = styled(HeadingLabelContainer)`
  width: 11.25rem;
`;

export const HeadingStatusContainer = styled(HeadingLabelContainer)`
  width: 4.875rem;
`;

export const EmptyListElementContainer = styled.div`
  align-items: center;
  background-color: white;
  display: flex;
  height: 2rem;
  margin-top: 0.25rem;
  justify-content: center;
  width: 100%;
`;

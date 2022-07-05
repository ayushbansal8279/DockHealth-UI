import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { Skeleton } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';

export const WorkflowIndicator = styled.span`
  font-size: 0.65rem;
  position: relative;
  font-weight: 700;
  bottom: -25px;
  left: 170px;
  font-weight: ${fontWeights.bold};
`;

export const BoardContainer = styled.div`
  display: inline-flex;
  flex: 1;
  height: 100%;
`;

export const BoardColumnContainer = styled.div`
  width: 245px;
  margin: 15px 25px 0 25px;
  display: flex;
  flex-direction: column;
`;

export const BoardColumnHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.smallPlus};
  border-radius: 4px;
  background: ${palette.white};
`;

export const TaskContainer = styled.div`
  background: ${palette.white};
  border: 1px solid rgba(204, 204, 204, 0.8);
  border-radius: 4px;
  padding: 12px;
  margin-top: 20px;
  width: 245px;
  height: 140px;
`;

export const BoardColumnTasksContainer = styled.div`
  ${({ isDragging }) => isDragging && 'cursor: grab;'}
  height: 100%;
  width: 245px;
`;

export const ColumnName = styled.div`
  font-weight: ${fontWeights.bold};
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
`;

export const TaskName = styled.div`
  overflow: hidden;
  width: 100%;
  max-height: 75px;
  height: 75px;
  cursor: pointer;
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;

  && {
    & .MuiButtonBase-root {
      width: 20px;
      min-width: 20px;
      height: 20px;
    }
  }
`;

export const PlusIcon = styled.div`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.light};
`;

export const Header = styled.div`
  display: flex;
`;

export const OptionsContainer = styled.div`
  position: relative;
  left: 10px;
`;

export const TaskActionsContainer = styled.div`
  padding: 12px 0;
  display: flex;
  align-items: center;
`;

export const LoaderRow = styled.div`
  display: flex;
  height: 35px;
  margin-top: 2px;
  flex-direction: row;
  align-items: center;
`;

export const BoardTaskLoader = withStyles({
  root: {
    height: 140,
    marginTop: 20,
    width: '100%',
  },
})(Skeleton);

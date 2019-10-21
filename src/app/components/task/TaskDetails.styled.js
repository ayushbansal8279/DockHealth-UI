import ButtonBase from '@material-ui/core/ButtonBase';
import styled from 'styled-components';

import TaskCheckbox from '../common/TaskCheckbox';

export const StyledCheckbox = styled(TaskCheckbox)`
  && {
    width: 36px;
    height: 36px;
  }
`;

export const StyledLabel = styled.td`
  border-top: 12px solid transparent;
  white-space: nowrap;
  min-width: 80px;
  font-size: 12px;
  font-weight: bold;
  text-align: right;
  vertical-align: middle;
`;

export const StyledDescription = styled.td`
  border-top: 12px solid transparent;
  width: 100%;
  padding-left: 16px;
  font-size: ${props => (props.big ? '16px' : '14px')};
  ${props => props.lineThrough && 'text-decoration: line-through;'}
`;

export const DetailsHeader = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledCloseButton = styled(ButtonBase)`
  && {
    margin-left: auto;
    width: 36px;
    height: 36px;
    background: #d9036b;
    border-radius: 50%;
    color: #fff;
    font-weight: bold;
  }
`;

export const BookmarkContainer = styled.div`
  width: 80px;
  display: flex;
  justify-content: center;
  margin-top: -13px;
`;

export const StatusContainer = styled.div`
  margin-left: 20px;
`;

export const DetailsContainer = styled.div`
  flex: 1;
  padding-right: 8px;
  padding-bottom: 4px;
  min-width: 500px;
`;

export const DetailsBox = styled.div`
  padding: 13px;
  margin-bottom: 4px;
  background: #fff;
  border: 2px solid #ddf2f7;
`;

export const StickyContainer = styled.div`
  position: sticky;
  top: 100;
`;

import styled from 'styled-components';
import spacing from 'styles/spacing';

export const VQuickAddTaskContainer = styled.div<{ $width: string }>`
  display: flex;
  margin-left: ${({ disableLeftOffset }: any) =>
    disableLeftOffset ? '24px' : '54.5px'};
  margin-bottom: 1px;
  margin-top: 10px;
  width: ${({ $width }: any) => $width};
`;

export const VQuickAddTask = styled('div')<{ $width: string }>`
  width: ${({ $width }: any) => $width};
  position: sticky;
  left: ${({ disableLeftOffset }: any) =>
    disableLeftOffset ? '24px' : '54.5px'};
  font-weight: bold;
  line-height: 40px;
`;

export const TaskTemplateApplicatorContainer = styled.div`
  position: absolute;
  right: 5px;
  top: 0px;
`;

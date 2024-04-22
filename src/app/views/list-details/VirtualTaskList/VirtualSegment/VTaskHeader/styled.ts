import palette from '@/app/styles/palette';
import styled from '@mui/styled-engine';

export const VTaskHeader = styled('div')`
  display: flex;
  font-size: 13px;
  line-height: 36px;
  height: ${({ groupWithZeroTask, bgColor }) =>
    groupWithZeroTask ? (bgColor ? '25px' : '7px') : '40px'};
  border-left: 1px solid rgb(229, 233, 242);
  ${({ $template }: any) => ($template ? 'margin-top: -5px' : 'margin-top: 0')};
  margin-bottom: -3px;
  background: ${({ bgColor }) => (bgColor ? palette.aliceBlue : '')};
  & > * > * {
    left: 54px;
  }
  background: white;
  border-bottom: 1px solid ${palette.coolGrey3};
  border-right: 1px solid ${palette.coolGrey3};
  border-top: 1px solid ${palette.coolGrey3};
  margin-right: 15.5px;
`;

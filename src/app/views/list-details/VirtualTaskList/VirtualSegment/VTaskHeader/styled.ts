import palette from '@/app/styles/palette';
import styled from '@mui/styled-engine';

export const VTaskHeader = styled('div')`
  display: flex;
  font-size: 13px;
  line-height: 40px;
  height: 40px;
  border-left: 1px solid rgb(229, 233, 242);
  ${({ $template }: any) => ($template ? 'margin-top: -5px' : 'margin-top: 0')};
  margin-bottom: -3px;
  background: ${({ bgColor }) => (bgColor ? palette.aliceBlue : '')};
  & > * > * {
    left: 54px;
  }
`;

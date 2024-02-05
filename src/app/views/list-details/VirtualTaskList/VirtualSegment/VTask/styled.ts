import styled from '@mui/styled-engine';

export const VTask = styled('div')`
  display: flex;
  font-size: 13px;
  ${({ $workflow }: any) => $workflow ? `
  line-height: 60px;
  height: 60px;
  ` : `
  line-height: 40px;
  height: 40px;
  `}
  border-left: 1px solid rgb(229, 233, 242);
  ${({ $template }: any) => ($template ? 'margin-top: -5px' : 'margin-top: 0')};

  & > * > * > * > * {
    left: 24px;
  }
`;

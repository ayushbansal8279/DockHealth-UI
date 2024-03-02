import styled from '@mui/styled-engine';

export const VTask = styled('div')`
  display: flex;
  font-size: 13px;
  ${({ $workflow }: any) => $workflow ? `
  line-height: 52px;
  height: 52px;
  ` : `
  line-height: 40px;
  height: 36px;
  `}
  border-left: 1px solid rgb(229, 233, 242);
  // ${({ $template }: any) => ($template ? 'margin-bottom: 1px' : '')};

  & > * > * > * > * {
    left: 24px;
  }
`;

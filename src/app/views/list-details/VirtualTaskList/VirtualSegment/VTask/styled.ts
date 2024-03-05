import styled from '@mui/styled-engine';

export const VTask = styled('div')`
  display: flex;
  font-size: 13px;
  ${({ $workflow }: any) =>
    $workflow
      ? `
  line-height: 52px;
  height: 52px;
  margin-bottom: -2px;
  `
      : `
  line-height: 40px;
  height: 36px;
  `}
  border-left: 1px solid rgb(229, 233, 242);
  margin-top: -1px;
  // ${({ $template }: any) => ($template ? 'margin-bottom: 1px' : '')};

  & > * > * > * > * {
    left: ${({ isTaskTemplate }: boolean) =>
      isTaskTemplate ? '71px' : '70px'};
  }
`;

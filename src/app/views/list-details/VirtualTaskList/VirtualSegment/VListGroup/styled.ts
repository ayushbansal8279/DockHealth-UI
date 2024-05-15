import styled from '@mui/styled-engine';

export const VListGroup = styled('div')`
  display: block;
  font-weight: bold;
  text-transform: uppercase;
  line-height: 40px;
  height: 40px;
  margin-top: ${({ bgColor }) => (bgColor ? '23px' : '0px')};
`;

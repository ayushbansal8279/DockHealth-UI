import styled from '@mui/styled-engine';

export const VAddGroup = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  position: sticky;
  font-weight: bold;
  height: 64px;
  margin-top: ${(props) => (props.active ? '5px' : '-15px')};
  margin-left: 24px;
`;

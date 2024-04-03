import styled from '@mui/styled-engine';
import spacing from 'styles/spacing';

export const VAddGroup = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  // padding-bottom: ${spacing.regular};
  position: sticky;
  // left: 48px;
  // padding-top: ${spacing.regular};
  font-weight: bold;
  // line-height: 40px;
  height: 64px;
  margin-top: ${(props) => (props.active ? '32px' : '-62px')};
  margin-left: 24px;
`;

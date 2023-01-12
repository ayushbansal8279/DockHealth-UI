import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  align-items: center;
  border: 1px solid ${palette.coolGrey2};
  border-radius: 3px;
  color: ${palette.orange};
  cursor: pointer;
  display: inline-flex;
  flex-flow: row nowrap;
  justify-content: center;
  height: 2.5rem;
  padding: ${spacing.tiny} ${spacing.small};
  margin: ${spacing.tiny};
  transition: all 0.25s ease-out;
  width: 2.5rem;
`;

import React from 'react';
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';

const StyledButton = styled.button`
  font-family: 'Montserrat', sans-serif;
  color: ${palette.darkBlue};
  border: 1.15px solid ${palette.darkBlue};
  font-weight: 600;
  padding: ${spacing.small} ${spacing.smallExtraPlus};
  width: fit-content;
  cursor: pointer;
`;

export const LoadMoreSection = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: ${spacing.large} 0;
`;

const LoadMoreButton = ({ onClick, disabled }) => (
  <StyledButton onClick={onClick} disabled={disabled}>
    LOAD MORE TASKS
  </StyledButton>
);

export default LoadMoreButton;

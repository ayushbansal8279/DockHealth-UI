import React from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';

const StyledLink = styled.a`
  color: ${palette.darkBlue};

  &:hover,
  &:active,
  &:focus {
    color: ${palette.darkBlue};
  }
`;

const EditorLink = ({ href, target, children }) => (
  <StyledLink target={target} onClick={() => window.open(href, target)}>
    {children}
  </StyledLink>
);

export default EditorLink;

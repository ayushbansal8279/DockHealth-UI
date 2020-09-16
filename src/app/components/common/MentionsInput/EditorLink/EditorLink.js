import React from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';

const StyledLink = styled.a`
  color: ${palette.darkBlue};

  &:hover {
    color: ${palette.darkBlue};
  }
`;

const EditorLink = ({ href, target, children }) => (
  <StyledLink href={href} target={target}>
    {children}
  </StyledLink>
);

export default EditorLink;

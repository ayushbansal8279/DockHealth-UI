import React from 'react';
import styled from 'styled-components';
import palette from 'app/palette';

const PriorityFlagContainer = styled.div`
  align-self: flex-start;
  cursor: pointer;
  margin-left: 22px;

  & > svg {
    transition: all 0.25s ease-out;
  }
`;

export default ({ active, ...props }) => (
  <PriorityFlagContainer {...props}>
    <svg
      width="24"
      height="37"
      viewBox="0 0 24 37"
      fill={active ? palette.orangeJulius : palette.unknownGrey6}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H24V37L12 28.4196L0 37V0Z"
      />
    </svg>
  </PriorityFlagContainer>
);

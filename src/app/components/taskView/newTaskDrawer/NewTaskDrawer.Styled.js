import React from 'react';
import styled from 'styled-components';

import palette, { opacify } from 'styles/palette';
import { RobotoTypography } from 'styles/theme';

export const TaskDrawerContainer = styled.div`
  background-color: ${palette.white};
  box-shadow: 0 0 ${({ open }) => (open ? 0.5 : 0)}rem
    ${opacify(palette.black, 0.2)};
  bottom: 0;
  padding: 2rem;
  position: fixed;
  right: 0;
  top: ${({ top }) => top}px;
  transform: translateX(${({ open }) => (open ? 0 : 100)}%);
  transition: all 0.25s ease-out;
  width: 756px;
  z-index: 100;
`;

export const AdornmentContainer = styled.div`
  align-items: center;
  align-self: flex-end;
  color: ${palette.orange};
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
  width: 2ch;
`;

export const PatientLabelContainer = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr 4rem 6rem;
  width: 100%;

  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const MemberLabelContainer = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr 30px;
  width: 100%;

  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const MemberAdornmentContainer = styled.div`
  align-self: flex-end;
  margin-bottom: 0.5rem;
  margin-right: 1rem;
`;

export const HiddenFieldContainer = styled.div`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
`;

export const EnvelopeIconContainer = styled.div`
  fill: ${palette.white};
`;

export const CondensedH4 = ({ ...props }) => (
  <RobotoTypography condensed variant="h4" {...props} />
);

export const BlockButton = styled.button`
  display: block;
  text-align: left;
  width: 100%;
`;

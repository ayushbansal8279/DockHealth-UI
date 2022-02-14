/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette, { opacify } from 'styles/palette';
import spacing from 'styles/spacing';

export const RemoveAttachmentButtonContainer = styled.div`
  align-items: center;
  color: ${palette.darkGrey};
  display: flex;
  height: 1rem;
  justify-content: center;
  margin-left: 0;
  overflow: hidden;
  transition: all 0.25s ease-out;
  width: 0;
`;

export const Container = styled.a`
  align-items: center;
  border: 1px solid ${palette.coolGrey1};
  border-radius: 3px;
  color: ${palette.darkGrey};
  display: inline-flex;
  flex-flow: row nowrap;
  height: 2.5rem;
  padding: ${spacing.tiny} ${spacing.small};
  margin: ${spacing.tiny};
  max-width: 196px; // per design
  transition: all 0.25s ease-out;

  &:hover {
    border-color: ${opacify(palette.coolGrey1, 0)};
    color: ${palette.darkGrey};

    ${RemoveAttachmentButtonContainer} {
      margin-left: ${spacing.small};
      padding: 0px 10px;
      width: 1rem;
    }
  }
`;

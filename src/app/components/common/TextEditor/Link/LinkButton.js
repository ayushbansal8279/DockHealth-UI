import React from 'react';
import LinkIcon from '@material-ui/icons/Link';
import { LinkButtonContainer, LinkButton } from './styled';

const Link = ({ buttonReference, popoverOpen, handleOpen }) => (
  <LinkButtonContainer
    onMouseDown={event => {
      event.preventDefault();
      event.stopPropagation();
    }}
    ref={buttonReference}
  >
    <LinkButton onClick={() => handleOpen(!popoverOpen)}>
      <LinkIcon />
    </LinkButton>
  </LinkButtonContainer>
);

export default Link;

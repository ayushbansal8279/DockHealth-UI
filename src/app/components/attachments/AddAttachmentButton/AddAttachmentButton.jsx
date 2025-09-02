import React, { useState } from 'react';
import { OutfitTypography } from 'styles/theme';
import { Container } from './styled';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';

const AddAttachmentButton = ({ attachmentOptions = [] }) => {

  const menuOptions = attachmentOptions.map((option, index) => ({
    name: option.label,
    onClick: (event) => {
      option.onClick?.(event);
      event.stopPropagation();
    },
    disabled: option.disabled,
    ...(option.getRootProps ? option.getRootProps() : {}),
  }));

  if (attachmentOptions.length === 0) {
    return (
      <div>
        <Container>
          <div>
            <OutfitTypography condensed variant="h4" color="inherit">
              +
            </OutfitTypography>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <OptionsMenu
        options={menuOptions}
        customButtonComponent={Container}
      >
        <div>
          <OutfitTypography condensed variant="h4" color="inherit">
            +
          </OutfitTypography>
        </div>
      </OptionsMenu>
    </div>
  );
};

export default AddAttachmentButton;

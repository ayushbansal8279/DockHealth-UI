import React from 'react';
import { InitialsInput } from './styled';

const OrganizationAvatarInput = React.forwardRef(
  (
    { name, placeholder, onChange, backgroundColor, value, size },
    reference,
  ) => {
    return (
      <InitialsInput
        ref={reference}
        name={name}
        placeholder={placeholder}
        backgroundColor={backgroundColor}
        onChange={onChange}
        value={value}
        size={size}
      />
    );
  },
);

export default OrganizationAvatarInput;

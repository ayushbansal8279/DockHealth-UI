import React from 'react';
import { CardBackground } from './styled';

const PopoverCard = ({ children }) => {
  return <CardBackground>{children}</CardBackground>;
};

export default PopoverCard;

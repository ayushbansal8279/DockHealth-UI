import React from 'react';
import ArrowIcon from 'img/arrow';
import { ArrowImg, ArrowContainer } from './styled';

const Arrow = ({ showArrow = true, isOpen, setOpen, children }) => {
  return (
    <ArrowContainer>
      {React.cloneElement(children, {
        isOpen,
        onClick: () => setOpen(!isOpen),
      })}
      {showArrow && (
        <ArrowImg
          alt="arrow"
          isOpen={isOpen}
          onClick={() => setOpen(!isOpen)}
          src={ArrowIcon}
        />
      )}
    </ArrowContainer>
  );
};

export default Arrow;

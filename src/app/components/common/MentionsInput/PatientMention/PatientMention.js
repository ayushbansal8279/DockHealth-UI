import { Popper } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import palette from 'styles/palette';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PatientMention = ({ mention, className, children, ...props }) => {
  const reference = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      className={className}
      ref={reference}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'rgba(7, 74, 134, 0.07)',
        color: palette.darkBlue,
        cursor: 'pointer',
      }}
      href={mention.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <Popper
        anchorEl={reference.current}
        open={isHovered}
        position="bottom-start"
        style={{ zIndex: 2000 }}
      >
        <div style={{ padding: '100px 20px', backgroundColor: 'red' }}>
          {mention.name}
        </div>
      </Popper>
    </a>
  );
};

export default PatientMention;

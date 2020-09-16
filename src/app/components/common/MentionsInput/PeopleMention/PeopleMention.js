// import { Popper } from '@material-ui/core';
import React, { useRef } from 'react';
import styled from 'styled-components';
import palette from 'styles/palette';

const MentionItem = styled.span`
  background-color: rgba(7, 74, 134, 0.07);
  color: ${palette.darkBlue};
  cursor: pointer;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PeopleMention = ({ mention, className, children }) => {
  const reference = useRef(null);
  // const [isHovered, setIsHovered] = useState(false);

  return (
    <MentionItem
      ref={reference}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      {children}
      {/* <Popper
        anchorEl={reference.current}
        open={isHovered}
        position="bottom-start"
        style={{ zIndex: 2000 }}
      >
        <div style={{ padding: '100px 20px', backgroundColor: 'red' }}>
          {mention.name}
        </div>
      </Popper> */}
    </MentionItem>
  );
};

export default PeopleMention;

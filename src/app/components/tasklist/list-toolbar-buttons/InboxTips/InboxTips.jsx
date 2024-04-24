import React, { useRef } from 'react';
import { ClickAwayListener, Popper } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useBoolean } from 'hooks/useBoolean';
import InboxHelpPanel from 'views/list-details/InboxHelpPanel/InboxHelpPanel';
import { ButtonContainer, ButtonWrapper } from '../styled';

const InboxTips = () => {
  const tipsButtonReference = useRef(null);
  const { 0: isOpen, 2: unsetOpen, 3: toggleOpen } = useBoolean(false);

  return (
    <ButtonContainer sx={{ ml: 1 }}>
      <ButtonWrapper
        reference={tipsButtonReference}
        variant="text"
        onClick={toggleOpen}
        startIcon={<LightbulbIcon />}
        sx={{ color: 'white' }}
      >
        Tips
      </ButtonWrapper>
      {isOpen && tipsButtonReference.current && (
        <Popper
          style={{ zIndex: 2001 }}
          anchorEl={tipsButtonReference?.current}
          placement="bottom-start"
          open={isOpen}
          onClose={unsetOpen}
        >
          <ClickAwayListener onClickAway={unsetOpen}>
            <div>
              <InboxHelpPanel />
            </div>
          </ClickAwayListener>
        </Popper>
      )}
    </ButtonContainer>
  );
};

export default InboxTips;

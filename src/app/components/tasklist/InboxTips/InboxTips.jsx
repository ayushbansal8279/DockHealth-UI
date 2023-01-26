import React, { useRef } from 'react';
import { ClickAwayListener, Popper } from '@mui/material';
import { useBoolean } from 'hooks/useBoolean';
import Button from 'components/common/Button/Button';
import InboxHelpPanel from 'views/list-details/InboxHelpPanel/InboxHelpPanel';
import LightbulbBlue from 'img/lightbulb-blue.svg';
import Lightbulb from 'img/lightbulb-grey.svg';

const InboxTips = () => {
  const tipsButtonReference = useRef(null);
  const { 0: isOpen, 2: unsetOpen, 3: toggleOpen } = useBoolean(false);

  return (
    <div style={{ height: '46px', paddingTop: '4px' }}>
      <Button
        reference={tipsButtonReference}
        variant="text"
        onClick={toggleOpen}
        startIcon={
          <img alt="lightbulb" src={isOpen ? LightbulbBlue : Lightbulb} />
        }
      >
        Tips
      </Button>
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
    </div>
  );
};

export default InboxTips;

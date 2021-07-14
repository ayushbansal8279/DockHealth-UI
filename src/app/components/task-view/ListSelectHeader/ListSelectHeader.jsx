import React, { useState, useRef } from 'react';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';

import {
  ListDescription,
  RolloverPopover,
  DarkPopover,
  LabelBig,
  LabelSmall,
} from './styled';

function trunc(text, maxLength = 30) {
  return text?.length > maxLength
    ? `${text?.substring(0, maxLength)}...`
    : text;
}

const ListSelectHeader = ({ taskList }) => {
  const { listName, listDescription } = taskList || {};
  const [popoverLabel, setPopoverLabel] = useState(null);
  const hoveredItemReference = useRef(null);
  const [bigPopover, setBigPopover] = useState(false);

  const handleMouseEnter = (
    event,
    listNameProperty,
    bigPopoverState,
    relevant,
  ) => {
    if (!relevant) return;
    const { target } = event;
    hoveredItemReference.current = target;
    setPopoverLabel(listNameProperty);
    setBigPopover(bigPopoverState);
  };

  const handleMouseLeave = () => {
    setPopoverLabel(null);
    setBigPopover(false);
  };
  const longName = listName?.length > 30;
  const longDescription = listDescription?.length > 100;
  return (
    <GenericHeader>
      <div
        onMouseEnter={event =>
          handleMouseEnter(event, listName, true, longName)
        }
        onMouseLeave={() => handleMouseLeave()}
      >
        {trunc(listName, 27)}
      </div>
      <ListDescription>
        <div
          onMouseEnter={event =>
            handleMouseEnter(event, listDescription, false, longDescription)
          }
          onMouseLeave={() => setPopoverLabel(null)}
        >
          {trunc(listDescription, 97)}
        </div>
      </ListDescription>
      <RolloverPopover
        anchorEl={hoveredItemReference?.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={!!popoverLabel}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transitionDuration={100}
      >
        <DarkPopover>
          <LabelBig>{bigPopover && popoverLabel}</LabelBig>
          <LabelSmall>{!bigPopover && popoverLabel}</LabelSmall>
        </DarkPopover>
      </RolloverPopover>
    </GenericHeader>
  );
};

export default ListSelectHeader;

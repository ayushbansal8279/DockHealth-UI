import React, { useState, useRef } from 'react';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import { trunc } from 'helpers/utility-functions';

import {
  ListDescription,
  RolloverPopover,
  DarkPopover,
  LabelBig,
  LabelSmall,
} from './styled';

const ListSelectHeader = ({ taskList }) => {
  const { listName, listDescription } = taskList || {};
  const [popoverLabel, setPopoverLabel] = useState(null);
  const hoveredItemReference = useRef(null);
  const [bigPopover, setBigPopover] = useState(false);
  const longName = listName?.length > 30;
  const longDescription = listDescription?.length > 100;

  const handleDescriptionMouseEnter = event => {
    if (!longDescription) return;
    const { target } = event;
    hoveredItemReference.current = target;
    setPopoverLabel(listDescription);
    setBigPopover(false);
  };

  const handleNameMouseEnter = event => {
    if (!longName) return;
    const { target } = event;
    hoveredItemReference.current = target;
    setPopoverLabel(listName);
    setBigPopover(true);
  };

  const handleMouseLeave = () => {
    setPopoverLabel(null);
  };

  return (
    <GenericHeader>
      <div onMouseEnter={handleNameMouseEnter} onMouseLeave={handleMouseLeave}>
        {trunc(listName, 27)}
      </div>
      <ListDescription>
        <div
          onMouseEnter={handleDescriptionMouseEnter}
          onMouseLeave={handleMouseLeave}
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

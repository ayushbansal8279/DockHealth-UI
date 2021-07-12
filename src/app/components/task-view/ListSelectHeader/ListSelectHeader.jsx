import React, { useState, useRef } from 'react';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import {
  ListDescription,
  RolloverPopover,
  RolloverPopoverDescription,
  RolloverPopoverLabel,
} from './styled';

function trunc(text, maxLength) {
  return text?.length > maxLength
    ? `${text?.substring(0, maxLength)}...`
    : text;
}

const ListSelectHeader = ({ taskList }) => {
  const { listName, listDescription } = taskList || {};
  const [popoverLabel, setPopoverLabel] = useState(null);
  const hoveredItemReference = useRef(null);

  const handleMouseEnter = (event, listNameProperty) => {
    const { target } = event;
    hoveredItemReference.current = target;
    setPopoverLabel(listNameProperty);
  };
  if (listName?.length > 30 || listDescription?.length > 100) {
    return (
      <div
        onMouseEnter={event => handleMouseEnter(event, listName)}
        onMouseLeave={() => setPopoverLabel(null)}
      >
        <GenericHeader>
          {trunc(listName, 27)}
          <ListDescription>{trunc(listDescription, 87)}</ListDescription>
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
            <span>
              <RolloverPopoverLabel>{popoverLabel}</RolloverPopoverLabel>
              <RolloverPopoverDescription>
                {listDescription}
              </RolloverPopoverDescription>
            </span>
          </RolloverPopover>
        </GenericHeader>
      </div>
    );
  }
  return (
    <>
      <GenericHeader>
        {listName}
        <ListDescription>{listDescription}</ListDescription>
      </GenericHeader>
    </>
  );
};

export default ListSelectHeader;

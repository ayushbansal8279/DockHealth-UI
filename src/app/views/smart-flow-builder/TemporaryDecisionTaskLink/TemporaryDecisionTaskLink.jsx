import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  deleteTemporaryElement,
  editTemporaryElement,
} from 'actions/task-template-actions';
import { useBoolean } from 'hooks/useBoolean';
import { getEdgeCenter } from 'react-flow-renderer';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LinkPath from '../LinkPath/LinkPath';
import TaskLinkOptions from '../TaskLinkOptions/TaskLinkOptions';
import OutcomeInputLabel from '../OutcomeInputLabel/OutcomeInputLabel';

const TemporaryDecisionTaskLink = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  } = props;
  const centerReference = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [areOptionsOpen, openOptions, closeOptions] = useBoolean(false);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  const dispatch = useDispatch();

  const menuOptions = [
    {
      key: 'delete',
      icon: <DeleteOutlineIcon style={{ height: 13 }} />,
      label: `Delete link`,
      onClick: () => {
        dispatch(deleteTemporaryElement(id));
      },
    },
  ];

  const handleBlur = () => {
    if (inputValue?.length > 0) {
      dispatch(editTemporaryElement(id, { outcomeName: inputValue }));
    }
  };

  return (
    <>
      <LinkPath {...props} />
      <foreignObject
        width={200}
        height={32}
        x={edgeCenterX - 160 / 2}
        y={edgeCenterY - 32 / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
        style={{ overflow: 'visible' }}
        onMouseEnter={openOptions}
        onMouseLeave={closeOptions}
      >
        <OutcomeInputLabel
          ref={centerReference}
          value={inputValue}
          onChange={(event) => setInputValue(event.target?.value || '')}
          onBlur={handleBlur}
        />
        {areOptionsOpen && (
          <TaskLinkOptions
            anchorEl={centerReference.current}
            options={menuOptions}
            onClose={closeOptions}
          />
        )}
      </foreignObject>
    </>
  );
};

export default TemporaryDecisionTaskLink;

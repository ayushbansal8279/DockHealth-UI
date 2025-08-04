import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTemporaryElement } from 'actions/task-template-actions';
import { useBoolean } from 'hooks/useBoolean';
import { getSmoothStepPath } from 'reactflow';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkPath from '../LinkPath/LinkPath';
import TaskLinkOptions from '../TaskLinkOptions/TaskLinkOptions';

const TemporaryTaskLink = (props) => {
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
  const [areOptionsOpen, openOptions, closeOptions] = useBoolean(false);
  const [, edgeCenterX, edgeCenterY] = getSmoothStepPath({
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
      icon: <DeleteIcon fontSize="small" color="inherit" />,
      label: `Delete link`,
      onClick: () => {
        dispatch(deleteTemporaryElement(id));
      },
    },
  ];

  return (
    <>
      <LinkPath {...props} onClick={openOptions} />
      <foreignObject
        width={200}
        height={32}
        x={edgeCenterX - 160 / 2}
        y={edgeCenterY - 32 / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
        style={{ overflow: 'visible' }}
      >
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

export default TemporaryTaskLink;

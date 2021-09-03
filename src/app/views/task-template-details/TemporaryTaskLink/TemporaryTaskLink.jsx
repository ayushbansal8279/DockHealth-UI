import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTemporaryElement } from 'actions/task-template-actions';
import useBoolean from 'hooks/useBoolean';
import { getEdgeCenter } from 'react-flow-renderer';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import LinkPath from '../LinkPath/LinkPath';
import TaskLinkOptions from '../TaskLinkOptions/TaskLinkOptions';

const TemporaryTaskLink = props => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
  } = props;
  const centerReference = useRef(null);
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

  useEffect(() => {
    if (selected) {
      openOptions();
    }
  }, [openOptions, selected]);

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

  return (
    <>
      <LinkPath {...props} />
      <foreignObject
        ref={centerReference}
        width={0}
        height={0}
        x={edgeCenterX}
        y={edgeCenterY}
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

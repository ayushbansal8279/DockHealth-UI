import React, { useEffect, useRef, useState } from 'react';
import Spacing from 'components/common/Spacing';
import {
  TaskBasicLabel,
  TaskLabelText,
  TaskLabelTextContainer,
  AdditionalTaskLabelText,
  AdditionalTaskLabelCounter,
  AdditionalTaskLabelContainer,
} from './styled';
import Tooltip from '../Tooltip/Tooltip';
import { useTaskListColumnsConfig } from '@/app/context-api/columns-config-context';

const TaskLabel = ({
  labels,
  getLabelsIconTooltipTitle,
  onClick,
  ...props
}) => {
  const { columns } = useTaskListColumnsConfig();
  const labelColumn = columns.filter((column) => {
    if (column.identifier === 'LABELS') return column.columnWidth;
  });
  const [addBadgeLength, setAddBadgeLength] = useState(0);
  const font = '14px Outfit';
  const getWidthOfString = (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const width = context.measureText(text).width;
    canvas.remove();
    return Math.floor(width) > 160 ? 135 : width;
  };

  useEffect(() => {
    let totalWidth = 0;
    labels.forEach((label, index) => {
      const text = label?.labelName;
      const width = getWidthOfString(text, font);
      totalWidth += Math.floor(width) + 30;
      totalWidth > labelColumn[0]?.columnWidth
        ? setAddBadgeLength((cur) => (cur === labels?.length ? cur : cur + 1))
        : setAddBadgeLength((cur) => (cur === 0 ? 0 : cur - 1));
    });
  }, [labels, labelColumn[0]?.columnWidth]);

  const additionalLabelbadge = labels.slice(labels?.length - addBadgeLength);

  return (
    <>
      {labels
        ?.slice(0, labels?.length - addBadgeLength)
        ?.map((label, index) => {
          return (
            <>
              <TaskBasicLabel
                key={label?.identifier}
                // ref={itemRefs[index]}
              >
                <Tooltip
                  placement="top"
                  title={!!label?.labelName ? label?.labelName : ''}
                >
                  <button onClick={onClick} type="button">
                    <TaskLabelTextContainer>
                      <TaskLabelText>{label?.labelName}</TaskLabelText>
                    </TaskLabelTextContainer>
                  </button>
                </Tooltip>
              </TaskBasicLabel>
              <Spacing horizontal={3} />
            </>
          );
        })}
      {additionalLabelbadge?.length > 0 && (
        <>
          <AdditionalTaskLabelCounter
          // ref={additionalLabelBadgeRef}
          >
            <Tooltip
              placement="top"
              title={getLabelsIconTooltipTitle(additionalLabelbadge)}
            >
              <button onClick={onClick} type="button">
                <AdditionalTaskLabelContainer>
                  <AdditionalTaskLabelText>
                    {'+' + additionalLabelbadge?.length}
                  </AdditionalTaskLabelText>
                </AdditionalTaskLabelContainer>
              </button>
            </Tooltip>
          </AdditionalTaskLabelCounter>
        </>
      )}
    </>
  );
};

export default TaskLabel;

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
  // labelName,
  // key,
  // showLabelsRef,
  ...props
}) => {
  const { columns } = useTaskListColumnsConfig();
  const labelColumn = columns.filter((column) => {
    if (column.identifier === 'LABELS') return column.columnWidth;
  });
  const [additionalLabelbadgeLength, setBadgeLength] = useState(0);
  console.log('additionalLabelbadgeLength', additionalLabelbadgeLength);
  const itemRefs = labels.map(() => useRef(null));
  const totalWidthRef = useRef(0);
  const additionalLabelBadgeRef = useRef(null);

  const additionalLabelbadge = labels.slice(
    labels?.length - additionalLabelbadgeLength,
  );
  let totalWidth = 0;
  useEffect(() => {
    itemRefs.forEach((itemRef, index) => {
      // console.log('inside itemRef.current', itemRef?.current);
      if (itemRef?.current) {
        console.log(
          `Width of item ${index + 1}:`,
          itemRef?.current?.offsetWidth,
        );
        // console.log('Inside if');
        // console.log(
        //   'itemRef.current.offsetWidth',
        //   itemRef?.current?.offsetWidth,
        // );
        totalWidth += itemRef.current?.offsetWidth;
        totalWidth + 20 > labelColumn[0]?.columnWidth
          ? setBadgeLength((cur) => cur + 1)
          : setBadgeLength(0);
        console.log('columnWodth', labelColumn[0]?.columnWidth);
      }
      console.log('totalWidth', totalWidth);

      totalWidthRef.current = totalWidth;
    });
  }, [labels, labelColumn[0]?.columnWidth]);
  console.log('totalWidthRef.current', totalWidthRef.current);
  // console.log('labelColumnWidth', labelColumn[0]?.columnWidth);
  // const showLabelsRef = useRef(null);

  // console.log('showLabelRef111', showLabelsRef?.current?.offsetWidth);
  // console.log(
  //   'additionalLabelBadgeref',
  //   additionalLabelBadgeref?.current?.offsetWidth,
  // );

  // totalWidthRef?.current > 0
  //   ? totalWidthRef?.current > labelColumn[0]?.columnWidth
  //     ? labels.slice(0, 2)
  //     : ''
  //   : labels.slice(0);
  // console.log('showLabels', showLabels);

  // console.log('labels1111', labels);
  // console.log(
  //   'showLabelsRef + additionalLabelBadgeref',
  //   showLabelsRef?.current?.offsetWidth +
  //     additionalLabelBadgeref?.current?.offsetWidth,
  // );
  // console.log('additionalLabelbadge', additionalLabelbadge);
  return (
    <>
      {labels
        ?.slice(0, labels?.length - additionalLabelbadgeLength)
        ?.map((label, index) => {
          return (
            <>
              <TaskBasicLabel ref={itemRefs[index]}>
                <Tooltip
                  placement="top"
                  title={!!label?.labelName ? label?.labelName : ''}
                >
                  <TaskLabelTextContainer>
                    <TaskLabelText>{label?.labelName}</TaskLabelText>
                  </TaskLabelTextContainer>
                </Tooltip>
              </TaskBasicLabel>
              <Spacing horizontal={3} />
            </>
          );
        })}
      {additionalLabelbadgeLength > 0 && (
        <>
          <AdditionalTaskLabelCounter ref={additionalLabelBadgeRef}>
            <Tooltip
              placement="top"
              title={getLabelsIconTooltipTitle(additionalLabelbadge)}
            >
              <AdditionalTaskLabelContainer>
                <AdditionalTaskLabelText>
                  {'+' + additionalLabelbadgeLength}
                </AdditionalTaskLabelText>
              </AdditionalTaskLabelContainer>
            </Tooltip>
          </AdditionalTaskLabelCounter>
        </>
      )}
    </>
  );
};

export default TaskLabel;

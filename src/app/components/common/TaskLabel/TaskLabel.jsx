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
  const [showLabels, setShowLabels] = useState([]);
  const [showAdditionalBadge, setAdditionalLabelbadge] = useState([]);
  console.log('showLabels', showLabels);
  console.log('showAdditionalBadge', showAdditionalBadge);

  const addShowLabel = (label) => {
    const labelExist = showLabels.some(
      (object) => object?.labelName === label?.labelName,
    );
    labelExist
      ? setShowLabels((prevLabels) => [...prevLabels])
      : setShowLabels((prevLabels) => [...prevLabels, label]);
    removeBadgeLabel(label);
  };

  const removeShowLabel = (label) => {
    const labelExist = showLabels.some(
      (object) => object?.labelName === label?.labelName,
    );
    console.log('labelExistShowRemove', labelExist);

    const filteredObjects = labelExist
      ? showLabels.filter((object) => object?.labelName !== label?.labelName)
      : showLabels;

    setShowLabels(filteredObjects);
  };

  const addBadgeLabel = (label) => {
    const labelExist = showAdditionalBadge.some(
      (object) => object?.labelName === label?.labelName,
    );
    labelExist
      ? setAdditionalLabelbadge((prevLabels) => [...prevLabels])
      : setAdditionalLabelbadge((prevLabels) => [...prevLabels, label]);
    removeShowLabel(label);
  };

  const removeBadgeLabel = (label) => {
    const labelExist = showAdditionalBadge.some(
      (object) => object?.labelName === label?.labelName,
    );

    console.log('labelExistBadgeRemove', labelExist);

    const filteredObjects = labelExist
      ? showAdditionalBadge.filter(
          (object) => object?.labelName !== label?.labelName,
        )
      : showAdditionalBadge;

    setAdditionalLabelbadge(filteredObjects);
  };

  // const [additionalLabelbadgeLength, setBadgeLength] = useState(0);

  // const itemRefs = labels.map(() => useRef(null));
  // const totalWidthRef = useRef(0);
  // const additionalLabelBadgeRef = useRef(null);

  // console.log('additionalLabelbadgeLength', additionalLabelbadgeLength);

  // , setAdditionalLabelbadge] = useState([]);

  // useEffect(() => {
  //   itemRefs.forEach((itemRef, index) => {
  //     // console.log('inside itemRef.current', itemRef?.current);
  //     if (itemRef?.current) {
  //       console.log(
  //         `Width of item ${index + 1}:`,
  //         itemRef?.current?.offsetWidth,
  //       );
  //       // console.log('Inside if');
  //       // console.log(
  //       //   'itemRef.current.offsetWidth',
  //       //   itemRef?.current?.offsetWidth,
  //       // );
  //       totalWidth += itemRef.current?.offsetWidth;
  //       totalWidth + 20 > labelColumn[0]?.columnWidth
  //         ? setBadgeLength((cur) => cur + 1)
  //         : setBadgeLength(0);
  //       console.log('columnWodth', labelColumn[0]?.columnWidth);
  //     }
  //     console.log('totalWidth', totalWidth);

  //     totalWidthRef.current = totalWidth;
  //   });
  // }, [labels, labelColumn[0]?.columnWidth]);

  const getWidthOfString = (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const width = context.measureText(text).width;
    canvas.remove();
    return width;
  };

  const font = '14px Outfit';

  useEffect(() => {
    let totalWidth = 0;
    // Example string
    labels.forEach((label, index) => {
      // console.log('additionalLabelbadgeLength', additionalLabelbadgeLength);
      const text = label?.labelName;
      const width = getWidthOfString(text, font);
      totalWidth = totalWidth + Math.floor(width);
      console.log('totalWidth', totalWidth + 50);
      console.log('labelColumn[0]?.columnWidth', labelColumn[0]?.columnWidth);
      totalWidth + 50 > labelColumn[0]?.columnWidth
        ? addBadgeLabel(label)
        : addShowLabel(label);
    });
  }, [labelColumn[0]?.columnWidth]);

  // const additionalLabelbadge = labels.slice(
  //   labels?.length - additionalLabelbadgeLength,
  // );

  // console.log(
  //   'labelssss',
  //   labels?.slice(0, labels?.length - additionalLabelbadgeLength),
  // );

  return (
    <>
      {showLabels
        // ?.slice(0, labels?.length - additionalLabelbadgeLength)
        ?.map((label, index) => {
          return (
            <>
              <TaskBasicLabel
              // ref={itemRefs[index]}
              >
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
      {showAdditionalBadge?.length > 0 && (
        <>
          <AdditionalTaskLabelCounter
          // ref={additionalLabelBadgeRef}
          >
            <Tooltip
              placement="top"
              title={getLabelsIconTooltipTitle(showAdditionalBadge)}
            >
              <AdditionalTaskLabelContainer>
                <AdditionalTaskLabelText>
                  {'+' + showAdditionalBadge?.length}
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

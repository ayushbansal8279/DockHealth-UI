import React from 'react';
import MultiAssignPopover from 'components/task/MultiAssignPopover/MultiAssignPopover';
import { WrapperContainer, IconBox, AssigneeIcon } from './styled';

const BulkEditAssignToOption = ({
  // handleChangeAssigneTasks,
  selectedTaskListIdentifiers,
  isDisabled,
}) => {
  // const handleReasigningTask = (
  //   _,
  //   {
  //     bubbleColor,
  //     firstName,
  //     initials,
  //     lastName,
  //     profileThumbnailPictureHash,
  //     specialtyList,
  //     titleList,
  //     userId,
  //     userIdentifier,
  //     userName,
  //   },
  // ) => {
  //   handleChangeAssigneTasks({
  //     bubbleColor,
  //     firstName,
  //     initials,
  //     lastName,
  //     profileThumbnailPictureHash,
  //     specialtyList,
  //     titleList,
  //     userId,
  //     userIdentifier,
  //     userName,
  //   });
  // };

  return (
    <MultiAssignPopover
      taskListIdentifiers={selectedTaskListIdentifiers}
      onSelect={values => {
        console.log('onSelect', values);
      }}
      isDisabled={isDisabled}
    >
      <WrapperContainer disabled={isDisabled}>
        <IconBox>
          <AssigneeIcon />
        </IconBox>
        <p>Assignee</p>
      </WrapperContainer>
    </MultiAssignPopover>
  );
};
export default BulkEditAssignToOption;

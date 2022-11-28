import Checkbox from 'components/common/Checkbox/Checkbox';
import { substituteNameForIdInTokenizedText } from 'components/common/TextEditor/helpers';
import { formatDate } from 'helpers/formatters';
import React from 'react';
import { CheckboxContainerStyled } from './styled';

function TaskCheckBoxes({
  isTaskDescriptionIncluded,
  setIsTaskDescriptionIncluded,
  isTaskDetailsIncluded,
  setIsTaskDetailsIncluded,
  isTaskCommentsIncluded,
  setIsTaskCommentsIncluded,
  insertTextFromTask,
  selectedTask,
  displayOnlyDescription = false,
}) {
  const {
    details,
    comments,
    description,
    tokenizedDescription,
    taskMentions,
    tokenizedDetails,
  } = selectedTask;

  let includeCheckBoxes = [
    {
      label: 'Task Description',
      value: isTaskDescriptionIncluded,
      disabled: !description,
      onClick: () => {
        const flag = !isTaskDescriptionIncluded;
        if (flag) {
          setIsTaskDescriptionIncluded(flag);
          insertTextFromTask({
            meta: description,
            name: '_DESCRIPTION_',
            tokenized: `Task Description: ${substituteNameForIdInTokenizedText(
              tokenizedDescription,
              taskMentions,
            )}`,
          });
        }
      },
    },
    {
      label: 'Task Details',
      value: isTaskDetailsIncluded,
      disabled: !details,
      onClick: () => {
        const flag = !isTaskDetailsIncluded;
        if (flag) {
          setIsTaskDetailsIncluded(flag);
          insertTextFromTask({
            meta: details,
            tokenized: `Task Details: ${substituteNameForIdInTokenizedText(
              tokenizedDetails,
              taskMentions,
            )}`,
          });
        }
      },
    },
    {
      label: 'Task Comments',
      value: isTaskCommentsIncluded,
      disabled: comments.length === 0,
      onClick: () => {
        const flag = !isTaskCommentsIncluded;
        if (flag) {
          setIsTaskCommentsIncluded(flag);
          const commentsContent = comments
            .map(comment => {
              return `Comment by ${comment.creator.name} at ${formatDate(
                comment.dateCreated,
              )} \n ${comment.tokenizedComment}`;
            })
            .join('\n');
          insertTextFromTask({
            meta: commentsContent,
            tokenized: `Task Comments: ${commentsContent}`,
            name: '_COMMENTS_',
          });
        }
      },
    },
  ];

  includeCheckBoxes = displayOnlyDescription
    ? includeCheckBoxes.splice(0, 1)
    : includeCheckBoxes;

  return includeCheckBoxes.map(checkbox => {
    return (
      <CheckboxContainerStyled key={checkbox.label}>
        <Checkbox
          size={18}
          onClick={checkbox.onClick}
          isChecked={checkbox.value}
          isDisabled={checkbox.disabled || checkbox.value}
        />
        <span>{checkbox.label}</span>
      </CheckboxContainerStyled>
    );
  });
}

export default TaskCheckBoxes;

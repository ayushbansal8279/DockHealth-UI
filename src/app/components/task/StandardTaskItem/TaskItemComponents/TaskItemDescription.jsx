/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable import/extensions */
import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  // useMemo,
} from 'react';
import { Box, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import {
  storeAsCurrentTask,
  updateTaskDescription,
} from 'actions/task-actions';
import { TaskStatus } from 'helpers/task-helpers';
import { openDrawer } from 'actions/task-drawer-actions';
import ReactHtmlParser from 'html-react-parser';
import { linkifyTextWithMentions } from 'components/common/RichTextEditor/helpers';
import Spacing from 'components/common/Spacing';
import EditIcon from '@mui/icons-material/Edit';
import PatientMention from 'components/common/TextEditor/PatientMention/PatientMention';
import UserMention from 'components/common/TextEditor/UserMention/UserMention';
import {
  // Description,
  DescriptionBox,
  CompletedBy,
  TaskItemParentTaskLabel,
  TaskItemDescriptionIndicators,
  // DescriptionTooltipWrapper,
  // DescriptionBorder,
  TaskContext,
  DescriptionEditButton,
  DescriptionInput,
} from '../../styled';

const TaskItemDescription = ({
  task,
  // isCompletedGroup,
  highlightedValue,
  hasParentTaskLabel,
  isEditing,
  setEditing,
  disabled,
  // disableMentions,
  // isEditButtonVisible = false,
  width,
}) => {
  const {
    description,
    // tokenizedDescription,
    taskMentions,
    status,
    parentTask,
    // searchMetaData,
    completedBy,
    completedDt,
    // taskList,
    linkedTaskTemplate,
    // read,
    tokenizedDescription,
  } = task;

  const [descriptionState, setDescriptionState] = useState(description);

  // const { taskListIdentifier } = taskList || {};
  // const { matchDescription } = searchMetaData || {};
  // const previousDescription = useRef(null);
  // const descriptionTextReference = useRef(null);
  const dispatch = useDispatch();
  // const [descriptionState, setDescriptionState] = useMentionsEditorState(
  //   convertToEditorState({
  //     rawText: description,
  //     tokenizedText: tokenizedDescription,
  //     mentions: taskMentions,
  //     handleRichText: false,
  //   }),
  // );
  const descriptionReference = useRef(null);
  const isCompleted = status === TaskStatus.COMPLETE;
  const isDecisionTask = task?.intentType === 'DECISION';

  const completedByName = completedBy
    ? `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}${
        completedBy?.credentials ? `, ${completedBy?.credentials}` : ''
      }`
        .trim()
        .replace(/^\.$/, '') || 'Unknown'
    : 'Unknown';

  useEffect(() => {
    setDescriptionState(description);
  }, [description]);

  useEffect(() => {
    if (isEditing && descriptionReference.current) {
      setTimeout(descriptionReference.current.focus, 0);
    }
  }, [isEditing, descriptionReference]);

  const onParentLabelClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      dispatch(openDrawer());
      dispatch(storeAsCurrentTask(parentTask));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parentTask],
  );

  const handleDescriptionChange = useCallback(
    (event) => {
      setEditing(false);
      if (task?.description !== event.target.value) {
        dispatch(
          updateTaskDescription(task, {
            tokenizedDescription: event.target.value,
            taskMentions: [],
          }),
        );
      }
    },
    [dispatch, setEditing, task],
  );

  // console.log(`split tokenized desciption:`, tokenizedDescription.split(/\s/));

  return (
    <DescriptionBox width={width}>
      <Box display="flex" flex={1}>
        {isEditing && (
          <DescriptionInput
            readOnly={!isEditing}
            value={descriptionState}
            autofocus={isEditing}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onChange={(event) => setDescriptionState(event.target.value)}
            onKeyDown={(event) =>
              event.keyCode === 13 && handleDescriptionChange(event)
            }
            onBlur={(event) => {
              handleDescriptionChange(event);
            }}
          />
        )}
        {!isEditing && (
          <div
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {tokenizedDescription.split(/\s/).map((word) => {
              // eslint-disable-next-line unicorn/prefer-ternary
              // console.log(`word:`, word);
              if (word.includes('[http') || word.includes('http')) {
                return ReactHtmlParser(
                  linkifyTextWithMentions(`${word} `, taskMentions),
                );
              }

              if (word[0] === '@') {
                const wordMentionIdentifier = word.split(/@{(.*?)}/)[1];
                const currentMention = taskMentions.find(
                  (m) => m.identifier === wordMentionIdentifier,
                );

                if (currentMention) {
                  return (
                    <UserMention
                      mention={currentMention}
                      className="fr-deletable fr-tribute"
                    >
                      <span data={currentMention.identifier}>
                        @{currentMention.name}{' '}
                      </span>
                    </UserMention>
                  );
                }
              }

              if (word[0] === '#') {
                const wordMentionIdentifier = word.split(/#{(.*?)}/)[1];
                const currentMention = taskMentions.find(
                  (m) => m.identifier === wordMentionIdentifier,
                );

                if (currentMention) {
                  return (
                    <PatientMention
                      mention={currentMention}
                      className="fr-deletable fr-tribute"
                    >
                      <span data={currentMention.identifier}>
                        @{currentMention.name}{' '}
                      </span>
                    </PatientMention>
                  );
                }
              }

              return (
                <Highlighter
                  highlightClassName="list-highlight"
                  searchWords={
                    highlightedValue
                      ? highlightedValue?.toLowerCase().split(/\s+/)
                      : []
                  }
                  autoEscape
                  textToHighlight={`${word} `}
                />
              );
            })}
          </div>
        )}
        {!isCompleted && (
          <DescriptionEditButton>
            <IconButton
              onClick={(event) => {
                if (!disabled) {
                  event.stopPropagation();
                  event.preventDefault();
                  setEditing(!isEditing);
                }
              }}
            >
              <EditIcon />
            </IconButton>
          </DescriptionEditButton>
        )}
      </Box>
      <TaskItemDescriptionIndicators>
        {isCompleted && (
          <CompletedBy isCompleted={isCompleted}>
            <span>{`By ${completedByName} ${
              completedDt &&
              ` on ${
                completedDt ? `${moment(completedDt).format('MM/DD/YYYY')}` : ''
              }`
            } ${
              linkedTaskTemplate ? `, launched ${linkedTaskTemplate.name}` : ''
            }
            `}</span>
          </CompletedBy>
        )}
        {hasParentTaskLabel && (
          <>
            {isCompleted && <Spacing horizontal={2} />}
            <TaskItemParentTaskLabel>
              Subtask of
              <span
                onClick={onParentLabelClick}
              >{` ${parentTask.description}`}</span>
            </TaskItemParentTaskLabel>
          </>
        )}
        {linkedTaskTemplate && !isCompleted && !isDecisionTask && (
          <TaskContext>
            <span
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              Triggers: {linkedTaskTemplate.name}
            </span>
          </TaskContext>
        )}
        {linkedTaskTemplate && !isCompleted && isDecisionTask && (
          <TaskContext>
            <span>Triggers a SmartFlow</span>
          </TaskContext>
        )}
      </TaskItemDescriptionIndicators>
    </DescriptionBox>
  );
};
export default TaskItemDescription;

/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable import/extensions */
import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  // useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import Highlighter from 'react-highlight-words';
import {
  storeAsCurrentTask,
  updateTaskDescription,
} from 'actions/task-actions';
import { TaskStatus } from 'helpers/task-helpers';
import { openDrawer } from 'actions/task-drawer-actions';
import ReactHtmlParser from 'html-react-parser';
import { linkifyTextWithMentions } from 'components/common/RichTextEditor/helpers';
import PatientMention from 'components/common/TextEditor/PatientMention/PatientMention';
import UserMention from 'components/common/TextEditor/UserMention/UserMention';
import {
  // Description,
  DescriptionBox,
  TaskItemDescriptionIndicators,
  // DescriptionTooltipWrapper,
  // DescriptionBorder,
  DescriptionEditButton,
  DescriptionInput,
} from '../../styled';
import { fontWeights } from '@/app/styles/font';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';
import EditPencil from '@/app/img/EditPencil';

const TaskItemDescription = ({
  task,
  // isCompletedGroup,
  highlightedValue,
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
    // taskList,
    read,
    tokenizedDescription,
  } = task;

  const [descriptionState, setDescriptionState] = useState(description);

  const [isSubtask, setIsSubtask] = useState(false);

  useEffect(() => {
    if (task?.parentTaskIdentifier) setIsSubtask(true);
  }, [task]);

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

  useEffect(() => {
    setDescriptionState(description);
  }, [description]);

  useEffect(() => {
    if (isEditing && descriptionReference.current) {
      setTimeout(descriptionReference.current.focus, 0);
    }
  }, [isEditing, descriptionReference]);

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

  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [tokenizedDescription]);

  const TooltipWrapper = isTruncated ? Tooltip : React.Fragment;

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
          <TooltipWrapper
            {...(isTruncated && {
              placement: 'top',
              title: tokenizedDescription,
            })}
          >
            <div
              ref={textRef}
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted && 'rgba(61, 72, 88, 0.50)',
                fontWeight: read ? fontWeights.light : fontWeights.bold,
              }}
            >
              {tokenizedDescription.split(/\s/).map((word, key) => {
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
                        key={key}
                        mention={currentMention}
                        className="fr-deletable fr-tribute"
                      >
                        <Link
                          to={`/core/assignedToPerson/${currentMention.identifier}`}
                        >
                          <span
                            data={currentMention.identifier}
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            @{currentMention.name}{' '}
                          </span>
                        </Link>
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
                        key={key}
                        mention={currentMention}
                        className="fr-deletable fr-tribute"
                      >
                        <span data={currentMention.identifier}>
                          #{currentMention.name}{' '}
                        </span>
                      </PatientMention>
                    );
                  }
                }

                return (
                  <Highlighter
                    key={key}
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
          </TooltipWrapper>
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
              <Tooltip placement="top" title="Edit Task Description">
                <EditPencil />
              </Tooltip>
            </IconButton>
          </DescriptionEditButton>
        )}
      </Box>
      <TaskItemDescriptionIndicators>
        {/* In Future this will move on Tooltip */}
        {/* {isCompleted && isHover && (
          <CompletedBy isCompleted={isCompleted}>
            <span>{`By ${completedByName} ${
              completedDt &&
              ` on ${
                completedDt ? `${moment(completedDt).format('MM/DD/YYYY')}` : ''
              }`
            } ${
              linkedTaskTemplate ? `, launched ${linkedTaskTemplate?.name}` : ''
            }
            `}</span>
          </CompletedBy>
        )} */}
        {/* {hasParentTaskLabel && (
          <>
            {isCompleted && <Spacing horizontal={2} />}
            <TaskItemParentTaskLabel>
              Subtask of
              <span
                onClick={onParentLabelClick}
              >{` ${parentTask?.description}`}</span>
            </TaskItemParentTaskLabel>
          </>
        )} */}
        {/* {linkedTaskTemplate && !isCompleted && !isDecisionTask && (
          <TaskContext>
            <span
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              Deploy: {linkedTaskTemplate.name}
            </span>
          </TaskContext>
        )}
        {linkedTaskTemplate && !isCompleted && isDecisionTask && (
          <TaskContext>
            <span>Deploy a SmartFlow</span>
          </TaskContext>
        )} */}
      </TaskItemDescriptionIndicators>
    </DescriptionBox>
  );
};
export default TaskItemDescription;

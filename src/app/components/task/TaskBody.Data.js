import moment from 'moment';
import { useSelector } from 'react-redux';

const getCountInfoData = ({ subtasks, comments }) => {
  const subtasksCount = subtasks?.length ?? 0;
  const commentsCount = comments?.length ?? 0;

  const countInfoContentArray = [];

  if (subtasksCount) {
    countInfoContentArray.push(
      `${subtasksCount} subtask${subtasksCount > 1 ? 's' : ''}`,
    );
  }

  if (commentsCount) {
    countInfoContentArray.push(
      `${commentsCount} comment${commentsCount > 1 ? 's' : ''}`,
    );
  }

  let countInfoContent = countInfoContentArray.join(' | ');

  if (countInfoContent.trim().length > 0) {
    countInfoContent = ` • ${countInfoContent.trim()}`;
  }

  return {
    countInfoContent,
  };
};

export default ({
  createdDateTime,
  completedDateTime,
  dueDate,
  subtasks,
  comments,
  creator,
  completedBy,
  isInbox,
}) => {
  const formattedCreationDate = moment(createdDateTime).format(
    '[on] MM/DD/YYYY [@] h:mma',
  );
  const dueDateMoment = moment(dueDate);
  const formattedDueDate = dueDateMoment.format('ddd, MMM D');
  const completedDateTimeMoment = moment(completedDateTime);
  const overdue = dueDateMoment.isBefore(moment().format('YYYY-MM-DD'));
  const formattedCompletedDateTime = completedDateTimeMoment.isValid()
    ? completedDateTimeMoment.format('[on] MM/DD/YYYY [@] h:mma')
    : '';

  const { countInfoContent } = getCountInfoData({ subtasks, comments });

  const completedByName =
    `${completedBy?.firstName.charAt(0)}. ${completedBy?.lastName}`
      .trim()
      .replace(/^\.$/, '') || 'Unknown';

  const completedByContent =
    formattedCompletedDateTime &&
    `Completed by ${completedByName} ${formattedCompletedDateTime}`;

  const firstLetterName = creator?.firstName?.charAt(0);
  const formattedUserName = `${firstLetterName ? `${firstLetterName}.` : ''} ${
    creator?.lastName
  }`;

  const members = useSelector(store =>
    isInbox
      ? [store.userState.userProfile]
      : store.taskListState.tasklistmembers,
  );

  const currentMoment = moment();
  const tenMinutesAgoMoment = moment().subtract(10, 'minutes');

  const hasNewComment =
    comments?.filter(({ dateCreated }) =>
      moment(dateCreated).isBetween(tenMinutesAgoMoment, currentMoment),
    ).length > 0 ?? false;

  return {
    formattedCreationDate,
    dueDateMoment,
    formattedDueDate,
    completedDateTimeMoment,
    formattedCompletedDateTime,
    countInfoContent,
    completedByName,
    completedByContent,
    formattedUserName,
    overdue,
    members,
    hasNewComment,
  };
};

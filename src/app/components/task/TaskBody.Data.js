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

  const countInfoContent = countInfoContentArray.join(' | ').trim();

  return {
    countInfoContent,
  };
};

const formatDateTimeMomentAccordingToCurrentTime = ({
  currentMoment,
  comparedMoment,
}) => {
  if (comparedMoment.isValid()) {
    if (currentMoment.isSame(comparedMoment, 'date')) {
      return comparedMoment.format('[@] h:mma');
    }

    return comparedMoment.format('[on] MM/DD/YYYY');
  }

  return '';
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
  const dueDateMoment = moment(dueDate);
  const formattedDueDate = dueDateMoment.format('ddd, MMM D');
  const completedDateTimeMoment = moment(completedDateTime);
  const overdue = dueDateMoment.isBefore(moment().format('YYYY-MM-DD'));

  const currentMoment = moment();

  const formattedCompletedDateTime = formatDateTimeMomentAccordingToCurrentTime(
    {
      currentMoment,
      comparedMoment: completedDateTimeMoment,
    },
  );

  const formattedCreationDate = formatDateTimeMomentAccordingToCurrentTime({
    currentMoment,
    comparedMoment: moment(createdDateTime),
  });

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

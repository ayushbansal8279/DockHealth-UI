/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector } from 'react-redux';

const initializeLabelsSectionHooks = ({ isInbox }) => {
  const { labels, areLabelsRequested } = useSelector(store => ({
    labels: isInbox
      ? store.taskLabelState.data.inboxLabels
      : store.taskLabelState.data.listLabels,
    areLabelsRequested: isInbox
      ? store.taskLabelState.requesting.inboxLabels
      : store.taskLabelState.requesting.listLabels,
  }));

  return {
    labels,
    areLabelsRequested,
  };
};

export default initializeLabelsSectionHooks;

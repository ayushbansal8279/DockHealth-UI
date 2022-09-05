import always from 'ramda/src/always';
import evolve from 'ramda/src/evolve';
import isNil from 'ramda/src/isNil';
import lensProp from 'ramda/src/lensProp';
import map from 'ramda/src/map';
import propSatisfies from 'ramda/src/propSatisfies';
import set from 'ramda/src/set';
import when from 'ramda/src/when';

const fromInbox = propSatisfies(isNil, 'taskList');
const inbox = { listName: 'Inbox', taskListIdentifier: '' };

/**
 *  Makes task with no taskList field
 *  correctly show that it's in the inbox.
 */
const fixTask = when(
  fromInbox,
  evolve({
    taskList: always(inbox),
    subtasks: map(set(lensProp('taskList'), inbox)),
  }),
);

export const fixList = map(fixTask);

export default fixTask;

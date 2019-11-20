import {
  always,
  evolve,
  isNil,
  lensProp,
  map,
  propSatisfies,
  set,
  when,
} from 'ramda';

const fromInbox = propSatisfies(isNil, 'taskList');
const inbox = { listName: 'Inbox', taskListId: 0 };

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

import concat from 'ramda/es/concat';
import curry from 'ramda/es/curry';
import defaultTo from 'ramda/es/defaultTo';
import groupBy from 'ramda/es/groupBy';
import head from 'ramda/es/head';
import isNil from 'ramda/es/isNil';
import keys from 'ramda/es/keys';
import map from 'ramda/es/map';
import path from 'ramda/es/path';
import pipe from 'ramda/es/pipe';
import prop from 'ramda/es/prop';
import propOr from 'ramda/es/propOr';
import sortBy from 'ramda/es/sortBy';
import toLower from 'ramda/es/toLower';
import uniq from 'ramda/es/uniq';
import values from 'ramda/es/values';

/**
 * @typedef {Object} TaskList
 * @property {Number} taskListId
 * @property {String} listName
 */

/**
 * @typedef {Object} Task
 * @property {TaskList} taskList
 */

const getTaskListFromTasks = pipe(
  head,
  propOr({}, 'taskList'),
);

const safeGroupBy = curry((getKey, list) =>
  isNil(list) ? [] : groupBy(getKey, list),
);

const sortByName = sortBy(
  pipe(
    prop('listName'),
    defaultTo(''),
    toLower,
  ),
);

/**
 * @type {function(Task[])}
 */
export const groupTasksByList = pipe(
  safeGroupBy(path(['taskList', 'taskListId'])),
  map(tasks => ({ ...getTaskListFromTasks(tasks), tasks })),
  values,
);

/**
 * @type {function(Task[], Task[])}
 */
export const groupTasksAndCompletedTasksByList = (tasks, completedTasks) => {
  const lists = safeGroupBy(path(['taskList', 'listName']), tasks);
  const completedLists = safeGroupBy(
    path(['taskList', 'listName']),
    completedTasks,
  );

  const listNames = uniq(concat(keys(lists), keys(completedLists)));

  const shape = listName => ({
    ...getTaskListFromTasks(propOr([], listName, lists)),
    ...getTaskListFromTasks(propOr([], listName, completedLists)),
    tasks: lists[listName],
    completedTasks: completedLists[listName],
  });
  const group = pipe(
    map(shape),
    values,
    sortByName,
  );

  return group(listNames);
};

export default groupTasksByList;

/**
 * @typedef {Object} TaskList
 * @property {Number} taskListIdentifier
 * @property {String} listName
 */
/**
 * @typedef {Object} Task
 * @property {TaskList} taskList
 */
import concat from 'ramda/src/concat';
import curry from 'ramda/src/curry';
import defaultTo from 'ramda/src/defaultTo';
import groupBy from 'ramda/src/groupBy';
import head from 'ramda/src/head';
import isNil from 'ramda/src/isNil';
import keys from 'ramda/src/keys';
import map from 'ramda/src/map';
import path from 'ramda/src/path';
import pipe from 'ramda/src/pipe';
import prop from 'ramda/src/prop';
import propOr from 'ramda/src/propOr';
import sortBy from 'ramda/src/sortBy';
import toLower from 'ramda/src/toLower';
import uniq from 'ramda/src/uniq';
import values from 'ramda/src/values';

const getTaskListFromTasks = pipe(head, propOr({}, 'taskList'));

const safeGroupBy = curry((getKey, list) =>
  isNil(list) ? [] : groupBy(getKey, list),
);

const sortByName = sortBy(pipe(prop('listName'), defaultTo(''), toLower));

/**
 * @type {function(Task[])}
 */
export const groupTasksByList = pipe(
  safeGroupBy(path(['taskList', 'taskListIdentifier'])),
  map((tasks) => ({ ...getTaskListFromTasks(tasks), tasks })),
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

  const shape = (listName) => ({
    ...getTaskListFromTasks(propOr([], listName, lists)),
    ...getTaskListFromTasks(propOr([], listName, completedLists)),
    tasks: lists[listName],
    completedTasks: completedLists[listName],
  });
  const group = pipe(map(shape), values, sortByName);

  return group(listNames);
};

export default groupTasksByList;

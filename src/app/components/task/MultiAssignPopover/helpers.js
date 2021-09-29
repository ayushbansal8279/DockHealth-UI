/* eslint-disable import/prefer-default-export */
import * as TaskListApi from 'api/task-list-api';
import { pipe, sortBy, prop, uniqBy, innerJoin } from 'ramda';

const convert = pipe(sortBy(prop('userName')), uniqBy(prop('identifier')));

export async function collectJoinedListMembers(taskListIdentifiers) {
  let listMemembers = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const listId of taskListIdentifiers) {
    // eslint-disable-next-line no-await-in-loop
    const responseMembers = await TaskListApi.getMembersByTaskListId(
      listId,
      'ALL',
    );
    if (listMemembers.length === 0) {
      listMemembers = listMemembers.concat(responseMembers);
    } else {
      listMemembers = innerJoin(
        (existingRecord, newRecord) =>
          existingRecord.identifier === newRecord.identifier,
        listMemembers,
        responseMembers,
      );
    }
  }
  return convert(listMemembers);
}

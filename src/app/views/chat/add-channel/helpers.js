import * as TaskListApi from 'api/task-list-api';
import pipe from 'ramda/src/pipe';
import sortBy from 'ramda/src/sortBy';
import prop from 'ramda/src/prop';
import uniqBy from 'ramda/src/uniqBy';
import innerJoin from 'ramda/src/innerJoin';

const convert = pipe(sortBy(prop('userName')), uniqBy(prop('identifier')));

export async function collectJoinedListMembers(taskListIdentifiers) {
  const uniqueTaskListIdentifiers = [...new Set(taskListIdentifiers)];
  let listMemembers = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const listId of uniqueTaskListIdentifiers) {
    // eslint-disable-next-line no-await-in-loop
    const responseMembers = await TaskListApi.getMembersByTaskListId(
      listId,
      'ALL',
    );
    listMemembers =
      listMemembers.length === 0
        ? // eslint-disable-next-line unicorn/prefer-spread
          listMemembers.concat(responseMembers)
        : innerJoin(
            (existingRecord, newRecord) =>
              existingRecord.identifier === newRecord.identifier,
            listMemembers,
            responseMembers,
          );
  }
  return convert(listMemembers);
}

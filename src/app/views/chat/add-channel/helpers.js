import * as TaskListApi from 'api/task-list-api';
import pipe from 'ramda/src/pipe';
import sortBy from 'ramda/src/sortBy';
import prop from 'ramda/src/prop';
import uniqBy from 'ramda/src/uniqBy';
import innerJoin from 'ramda/src/innerJoin';

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
    listMemembers =
      listMemembers.length === 0
        ? listMemembers.concat(responseMembers)
        : innerJoin(
            (existingRecord, newRecord) =>
              existingRecord.identifier === newRecord.identifier,
            listMemembers,
            responseMembers,
          );
  }
  return convert(listMemembers);
}

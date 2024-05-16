import { mergeArr } from '@/app/helpers/array-helpers';
import { FormattedMetaDataForState } from '@/app/modal/components/CustomFieldsBulkEditModal/helpers';
import { Task } from '@/app/types/Task';

export function updateCustomFieldsByTaskIdentifiers({
  oldTasksMap,
  taskIdentifiers,
  metaDataToUpdate,
}: {
  oldTasksMap: Record<string, Task>;
  taskIdentifiers: string[];
  metaDataToUpdate: FormattedMetaDataForState;
}): Record<string, Task> {
  const tasksMap = { ...oldTasksMap };

  for (const taskIdentifier of taskIdentifiers) {
    if (!(taskIdentifier in tasksMap)) continue;

    tasksMap[taskIdentifier] = {
      ...tasksMap[taskIdentifier],
      taskMetaData: mergeArr(
        tasksMap[taskIdentifier].taskMetaData,
        metaDataToUpdate,
        'customFieldIdentifier',
      ),
    };
  }

  return tasksMap;
}

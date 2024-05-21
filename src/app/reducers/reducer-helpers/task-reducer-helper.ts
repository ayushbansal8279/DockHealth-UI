import { mergeArr } from '@/app/helpers/array-helpers';
import { FormattedMetaDataForState } from '@/app/modal/components/BulkEditCustomFieldsModal/helpers';
import { Task } from '@/app/types/Task';

export function updateCustomFieldsByTaskIdentifiers({
  oldTasksMap,
  taskIdentifiers,
  taskWorkflowIdentifiers,
  metaDataToUpdate,
}: {
  oldTasksMap: Record<string, Task>;
  taskIdentifiers: string[];
  taskWorkflowIdentifiers: string[];
  metaDataToUpdate: FormattedMetaDataForState;
}): Record<string, Task> {
  const tasksMap = { ...oldTasksMap };

  for (const taskIdentifier of [
    ...taskIdentifiers,
    ...taskWorkflowIdentifiers,
  ]) {
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

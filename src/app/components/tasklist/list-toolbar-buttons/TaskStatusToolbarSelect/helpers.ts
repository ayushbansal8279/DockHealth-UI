import { TaskStatus } from '@/app/helpers/task-helpers';

export interface TaskStatusFormData {
  incomplete: boolean;
  complete: boolean;
}

export const convertTaskStatusFormDataToStatus = (
  formData: TaskStatusFormData,
) => {
  if (formData.incomplete && formData.complete) {
    return TaskStatus.ALL;
  }
  if (formData.incomplete) {
    return TaskStatus.INCOMPLETE;
  }
  return TaskStatus.COMPLETE;
};

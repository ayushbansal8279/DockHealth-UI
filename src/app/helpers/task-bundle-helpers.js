/* eslint-disable import/prefer-default-export */
import { TaskStatus } from './task-helpers';

export function checkIfHasIncompleteTasks(bundle) {
  return !!bundle.tasks?.some(({ status }) => status === TaskStatus.INCOMPLETE);
}

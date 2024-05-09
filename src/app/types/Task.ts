import { IComment } from './Comment';
import { TaskDto } from './swagger/models/TaskDto';

export interface Task extends TaskDto {
  comments?: IComment[];
}

export interface TaskColumn {
  identifier: string;
  _customFieldType: string;
  isChecked: boolean;
  columnWidth: number;
}

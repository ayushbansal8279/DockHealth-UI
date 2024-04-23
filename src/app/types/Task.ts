import { CommentDto } from './swagger/models/CommentDto';
import { TaskDto } from './swagger/models/TaskDto';

export interface Task extends TaskDto {
  comments?: CommentDto[];
}

export interface TaskColumn {
  identifier: string;
  _customFieldType: string;
  isChecked: boolean;
  columnWidth: number;
}

import { CommentDto } from './swagger/models/CommentDto';
import { TaskDto } from './swagger/models/TaskDto';

export interface Task extends TaskDto {
  comments?: CommentDto[];
}

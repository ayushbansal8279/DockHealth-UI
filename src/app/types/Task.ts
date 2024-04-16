import { CommentDto } from './swagger/models/CommentDto';
import { TaskDto } from './swagger/models/TaskDto';

export type Comment = CommentDto;

export interface Task extends TaskDto {
  comments?: Comment[];
}

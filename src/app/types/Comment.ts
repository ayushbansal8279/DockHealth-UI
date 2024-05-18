import { IUserSummary } from './user';

export interface IComment {
  comment: string;
  commentId: number;
  commentIdentifier: string;
  commentMentions: Array<any>;
  creator: IUserSummary;
  dateCreated: string;
  dateUpdated: string;
  hasMentiones: boolean;
  sortIndex?: number;
  taskIdentifier: string;
  taskWorkflowIdentifier?: string;
  tokenizedComment: string;
}

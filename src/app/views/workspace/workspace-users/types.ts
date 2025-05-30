export type CheckboxHeaderProps = {
  isListChecked: boolean;
  onListSelect: () => void;
};

export type CheckboxProps = {
  isChecked: boolean;
  onClick: () => void;
  isDisabled?: boolean;
  size?: number;
  isCircle?: boolean;
  borderHeight?: string | number;
};

export interface IWorkspaceUser {
  id: number,
  identifier: number;
  name: string;
  email: string;
  role: string;
  status: string;
  isSelected: boolean,
};
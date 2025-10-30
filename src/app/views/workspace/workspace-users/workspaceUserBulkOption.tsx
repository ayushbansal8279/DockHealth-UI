import ChangeRoleIcon from "@/app/img/bulk-edit/ChangeRoleIcon";
import DeleteIcon from "@/app/img/bulk-edit/DeleteIcon";

export const listBulkOptions = [
  {
    key: 'changeRoleOption',
    title: 'Change role',
    icon: ChangeRoleIcon,
    onClick: () => {},
  },
  {
    key: 'removeOption',
    title: 'Remove user',
    icon: DeleteIcon,
  }
];

export const listOptionNames = listBulkOptions.map(opt => opt.key);
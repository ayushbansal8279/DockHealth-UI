import DeleteIcon from "@/app/img/bulk-edit/DeleteIcon";
import InviteUserIcon from "@/app/img/bulk-edit/InviteUserIcon";

export const listBulkOptions = [
  {
    key: 'inviteOption',
    title: 'Invite User',
    icon: InviteUserIcon,
    onClick: () => {},
  },
  {
    key: 'deleteOption',
    title: 'Delete List',
    icon: DeleteIcon,
  }
];

export const listOptionNames = listBulkOptions.map(opt => opt.key);

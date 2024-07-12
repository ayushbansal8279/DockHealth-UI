import { Grid, Input, MenuItem, Select } from '@mui/material';
import { ListSelectContainer, ListTitle, ValidationError } from './styled';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import palette from '@/app/styles/palette';

const GroupSelectorSection = ({
  handleGroupChange,
  taskGroupIdentifier,
  groups,
  slectedListIdentifier,
}) => {
  const CustomIcon = () => <ArrowDropDownIcon sx={{ marginRight: 2 }} />;

  return (
    <Grid item xs={12}>
      <ListSelectContainer>
        <ListTitle>Group</ListTitle>
        <Select
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            background: palette.lightGrey2,
          }}
          IconComponent={CustomIcon}
          size="small"
          fullWidth
          placeholder="asdsa"
          value={taskGroupIdentifier}
          renderValue={(value) =>
            groups?.map((item) => {
              if (item.taskGroupIdentifier === value) {
                return item.groupName === 'DEFAULT'
                  ? 'New Tasks'
                  : item?.groupName;
              }
            })
          }
          disabled={!slectedListIdentifier}
        >
          {groups?.map((group) => (
            <MenuItem
              onClick={() => {
                handleGroupChange(group?.taskGroupIdentifier);
              }}
              value={group?.taskGroupIdentifier}
            >
              {group?.groupName === 'DEFAULT' ? 'New Tasks' : group?.groupName}
            </MenuItem>
          ))}
        </Select>
      </ListSelectContainer>
    </Grid>
  );
};

export default GroupSelectorSection;

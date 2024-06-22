import { Grid, Input, MenuItem, Select } from '@mui/material';
import { ListSelectContainer, ListTitle } from './styled';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import palette from '@/app/styles/palette';

const ListSelectorSection = ({
  handleListChange,
  slectedListIdentifier,
  lists,
  searchedKeyword,
  handleListSearch,
  searchedLists,
}) => {
  const CustomIcon = () => <ArrowDropDownIcon sx={{ marginRight: 2 }} />;

  return (
    <Grid item xs={12}>
      <ListSelectContainer>
        <ListTitle>List Name</ListTitle>
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
          value={slectedListIdentifier}
          renderValue={(value) =>
            lists?.map((item) => {
              if (item.taskListIdentifier === value) {
                return item.listName;
              }
            })
          }
        >
          <div style={{ maxHeight: '400px' }}>
            <Input
              value={searchedKeyword}
              fullWidth
              placeholder="Search"
              sx={{ padding: '5px 10px 5px 15px' }}
              onChange={handleListSearch}
            />
            {searchedLists?.map((list) => (
              <MenuItem
                onClick={() => {
                  handleListChange(list?.taskListIdentifier);
                }}
                value={list?.taskListIdentifier}
              >
                {list?.listName}
              </MenuItem>
            ))}
          </div>
        </Select>
      </ListSelectContainer>
    </Grid>
  );
};

export default ListSelectorSection;

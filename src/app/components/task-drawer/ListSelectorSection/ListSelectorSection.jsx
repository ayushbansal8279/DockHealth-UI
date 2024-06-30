import { Grid, Input, MenuItem, Select } from '@mui/material';
import { ListSelectContainer, ListTitle, ValidationError } from './styled';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import palette from '@/app/styles/palette';

const ListSelectorSection = ({
  handleListChange,
  slectedListIdentifier,
  lists,
  searchedKeyword,
  handleListSearch,
  searchedLists,
  isClicked,
}) => {
  const CustomIcon = () => <ArrowDropDownIcon sx={{ marginRight: 2 }} />;

  return (
    <Grid item xs={12}>
      <ListSelectContainer>
        <ListTitle>List</ListTitle>
        <Select
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            background: palette.lightGrey2,
            border:
              isClicked &&
              !slectedListIdentifier &&
              `1px solid ${palette.oPlusRed}`,
          }}
          IconComponent={CustomIcon}
          size="small"
          fullWidth
          placeholder="asdsa"
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
        {isClicked && !slectedListIdentifier && (
          <ValidationError>List name is required</ValidationError>
        )}
      </ListSelectContainer>
    </Grid>
  );
};

export default ListSelectorSection;

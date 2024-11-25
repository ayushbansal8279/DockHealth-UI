import React, { useEffect, useState } from 'react';
import { Divider, Input, MenuItem, Popover } from '@mui/material';
import {
  OptionsList,
  OptionsListContainer,
  SelectOptionsContainer,
} from './styled';

const EditFieldOptionsPopover = ({
  anchorEl,
  optionsList = [],
  onFilterSelect,
  open,
  onClose,
  getTemplatesList,
  idField = 'id',
  labelField = 'label',
  popoverZindex,
}) => {
  const [optionLists, setOptionLists] = useState(optionsList);

  useEffect(() => {
    setOptionLists(optionsList);
  }, [optionsList]);

  const handleOptionListSearch = (event) => {
    const filteredList = optionsList.filter((item) =>
      item[labelField]
        ?.toLowerCase()
        .includes(event.target.value.toLowerCase()),
    );
    setOptionLists(filteredList);
  };

  const groupedOptions = Object.entries(
    optionLists.reduce((acc, option) => {
      const targetType = option.targetType || 'Other';
      if (!acc[targetType]) {
        acc[targetType] = [];
      }
      acc[targetType].push(option);
      return acc;
    }, {})
  ).reduce((sortedAcc, [key, options]) => {
      sortedAcc[key] = options.sort((a, b) =>
        a[labelField].localeCompare(b[labelField])
    );
    return sortedAcc;
  }, {});

  return (
    <Popover
      sx={popoverZindex ? { zIndex: popoverZindex } : {}}
      PaperProps={{
        style: {
          width: 260,
          borderRadius: '7px 7px 0px 0px',
          overflowY: 'hidden',
          marginLeft: '95px',
          marginTop: '2px',
        },
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      anchorEl={anchorEl}
      open={open}
      onEnter={getTemplatesList}
      onClose={onClose}
    >
      <Input
        fullWidth
        placeholder="Search"
        sx={{ padding: '5px 10px 5px 15px' }}
        onChange={handleOptionListSearch}
      />
      <SelectOptionsContainer>
        <OptionsListContainer>
          <OptionsList>
            {Object.entries(groupedOptions).map(([targetType, options], index, array) => (
              <React.Fragment key={targetType}>
                  <MenuItem sx={{ padding: '8px 16px', fontWeight: 'bold' }}>
                    {targetType === 'TASK' ? 'Task Fields' : targetType === 'PATIENT' ? 'Patient Fields' : targetType}
                  </MenuItem>
                  {options.map((option) => (
                    <MenuItem
                      key={option[idField]}
                      onClick={() => onFilterSelect(option[idField])}
                      value={option[idField]}
                      sx={{
                        textOverflow: 'ellipsis',
                        paddingBottom: '8px',
                        paddingTop: '8px',
                      }}
                    >
                      {option[labelField]}
                    </MenuItem>
                ))}
                {index < array.length - 1 && <Divider sx={{ my: 1 }} />}
                </React.Fragment>
            ))}
          </OptionsList>
        </OptionsListContainer>
      </SelectOptionsContainer>
    </Popover>
  );
};

export default EditFieldOptionsPopover;

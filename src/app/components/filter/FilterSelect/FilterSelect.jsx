import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import CloseIcon from 'img/close_cross.svg';
import {
  OptionDropDown,
  OptionDropDownItem,
  OptionHolder,
  OptionInput,
  OptionItem,
  Title,
  DisplayValue,
  AvatarContainer,
  Lable,
  CloseIconContainer,
  PopupContainer,
} from './style';
import UserAvatar from '../../user/UserAvatar/UserAvatar';
import DateRangeOptions from '../DateRangeOptions/DateRangeOptions';
import palette from '@/app/styles/palette';
import { fontSizes } from '@/app/styles/font';

const FilterSelect = ({
  finalFilter,
  filterOptions,
  setFinalFilter,
  filter,
  filters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [filterdUser, setFilterdUser] = useState(filterOptions);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [isDateRange, setIsDateRange] = useState(false);

  useEffect(() => {
    setFilterdUser([
      ...filterOptions.filter(
        (item) => !finalFilter[filter].find((usr) => usr?.key === item?.key),
      ),
    ]);
  }, [filter, finalFilter, filterOptions]);

  useEffect(() => {
    filters.map((item) => {
      if (item?.id === filter) {
        setOptionName(item?.label);
      }
    });
  }, [filter]);

  useEffect(() => {
    finalFilter[filter].map((item) => {
      if (item?.key?.includes('DATE_RANGE')) {
        if (item.dateStart && item.dateEnd) {
          setDateStart(item.dateStart);
          setDateEnd(item.dateEnd);
        }
      }
    });
  }, [finalFilter]);

  useEffect(() => {
    if (dueDate !== null && startDate !== null) {
      let currentFinalFilter = { ...finalFilter };
      currentFinalFilter[filter].map((item, index) => {
        if (item.key.includes('DATE_RANGE')) {
          currentFinalFilter[filter][index] = {
            ...currentFinalFilter[filter][index],
            dateStart: startDate,
            dateEnd: dueDate,
          };
        }
      });

      setFinalFilter({ ...currentFinalFilter });
    }
  }, [dueDate, startDate, setStartDate, setDueDate]);

  const handleSelectOption = (item) => {
    if (isDateRange) {
      inputRef.current.textContent = '';
    }
    setFilterdUser((v) => v.filter((option) => option?.key !== item?.key));
    let currentFilter = { ...finalFilter };
    currentFilter[filter] = [
      ...currentFilter[filter],
      ...filterOptions.filter((user) => user?.key === item?.key),
    ];
    setFinalFilter({ ...currentFilter });
  };

  const handleSearchOption = (e) => {
    setFilterdUser(
      filterOptions.filter((option) =>
        option?.displayValue
          .toLowerCase()
          .includes(e.target.textContent.toLowerCase()),
      ),
    );
  };

  const handleRemoveAssign = (item) => {
    if (finalFilter[filter].find((user) => user.key === item?.key)) {
      const urs = { ...finalFilter };
      urs[filter] = finalFilter[filter].filter(
        (option) => option?.key !== item?.key,
      );
      setFinalFilter((v) => ({ ...urs }));
      setFilterdUser((v) => [...v, item]);
      const currentFilter = { ...finalFilter };
      currentFilter[filter] = currentFilter[filter].filter(
        (user) => user.key !== item?.key,
      );
    }
  };

  const handleRemoveOption = () => {
    const currentFilter = { ...finalFilter };
    delete currentFilter[filter];
    setFinalFilter({ ...currentFilter });
  };

  useEffect(() => {
    finalFilter[filter].map((item) => {
      if (item?.key?.includes('DATE_RANGE')) {
        setIsDateRange(true);
      }
    });
  }, [filter, finalFilter]);

  const TextFieldSX = {
    backgroundColor: palette.whiteSmoke,
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-notchedOutline': {
        border: `2px solid ${palette.crystalBlue}`,
      },
    },
    '& .MuiAutocomplete-tag': {
      height: '40px',
      backgroundColor: 'transparent',
      borderRadius: '8px',
      fontSize: fontSizes.regular,
      '& .MuiChip-deleteIcon': {
        backgroundColor: palette.lightGrey,
        borderRadius: '50%',
        color: 'white',
      },
      '&:hover': {
        '& .MuiChip-deleteIcon': {
          color: '#daefff',
        },
        backgroundColor: '#daefff',
      },
    },
    '& .MuiAutocomplete-endAdornment .MuiAutocomplete-clearIndicator': {
      display: 'none',
    },
  };

  return (
    <>
      <div>
        <Title>{optionName}</Title>
        {!isDateRange ? (
          <div style={{ display: 'flex' }}>
            <Autocomplete
              multiple
              options={filterdUser}
              disableCloseOnSelect
              getOptionLabel={(option) => option?.displayValue}
              renderOption={(props, option) => (
                <li {...props}>
                  <DisplayValue>
                    <AvatarContainer>
                      {optionName === 'Assigned by' ||
                      optionName === 'Assigned to' ? (
                        <UserAvatar user={option?.reference} />
                      ) : (
                        ''
                      )}
                    </AvatarContainer>
                    <Lable>{option?.displayValue}</Lable>
                  </DisplayValue>
                </li>
              )}
              style={{ width: '517' }}
              value={finalFilter[filter]}
              onChange={(event, newValue, action, option) => {
                if (action === 'selectOption') {
                  handleSelectOption(option.option);
                }
                if (action === 'removeOption') {
                  handleRemoveAssign(option.option);
                }
                if (action === 'clear') {
                  handleRemoveOption();
                }
              }}
              renderInput={(params) => (
                <TextField sx={TextFieldSX} {...params} />
              )}
            />
            <CloseIconContainer onClick={handleRemoveOption}>
              <img src={CloseIcon} alt="close" />
            </CloseIconContainer>
          </div>
        ) : (
          <>
            <div ref={containerRef} style={{ display: 'flex' }}>
              <OptionHolder>
                {finalFilter[filter].map((item, i) => (
                  <OptionItem key={i} contentEditable={false}>
                    <DisplayValue>
                      <AvatarContainer>
                        {optionName === 'Assigned by' ||
                        optionName === 'Assigned to' ? (
                          <UserAvatar user={item?.reference} />
                        ) : (
                          ''
                        )}
                      </AvatarContainer>
                      {item?.key?.includes('DATE_RANGE') ? (
                        <DateRangeOptions
                          dueDate={dueDate}
                          setDueDate={setDueDate}
                          startDate={startDate}
                          setStartDate={setStartDate}
                          dateEnd={dateEnd}
                          dateStart={dateStart}
                        />
                      ) : (
                        <Lable>{item?.displayValue}</Lable>
                      )}
                    </DisplayValue>
                    <div onClick={() => handleRemoveAssign(item)}>
                      <img
                        style={{
                          width: '19px',
                          margin: '2px 4px',
                          cursor: 'pointer',
                        }}
                        src={CloseIcon}
                        alt="close"
                      />
                    </div>
                  </OptionItem>
                ))}
                <OptionInput
                  onClick={() => setIsOpen((v) => !v)}
                  ref={inputRef}
                  contentEditable={false}
                  onInput={(e) => handleSearchOption(e)}
                ></OptionInput>
              </OptionHolder>
              <CloseIconContainer onClick={handleRemoveOption}>
                <img src={CloseIcon} alt="close" />
              </CloseIconContainer>
            </div>
            {isOpen && (
              <PopupContainer>
                <OptionDropDown>
                  {filterdUser.map((item, i) => (
                    <OptionDropDownItem
                      key={item?.key}
                      onClick={() => handleSelectOption(item)}
                    >
                      <DisplayValue>
                        <AvatarContainer>
                          {optionName === 'Assigned by' ||
                          optionName === 'Assigned to' ? (
                            <UserAvatar user={item?.reference} />
                          ) : (
                            ''
                          )}
                        </AvatarContainer>
                        <Lable>{item?.displayValue}</Lable>
                      </DisplayValue>
                    </OptionDropDownItem>
                  ))}
                </OptionDropDown>
              </PopupContainer>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FilterSelect;

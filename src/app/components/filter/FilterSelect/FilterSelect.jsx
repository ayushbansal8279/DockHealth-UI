import { Popover } from '@mui/material';
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

const FilterSelect = ({
  finalFilter,
  filterOptions,
  setFilter,
  filter,
  menuOptions,
  filteredData,
  setFilteredData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [filterdUser, setFilterdUser] = useState(filterOptions);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    setFilterdUser([
      ...filterOptions.filter(
        (item) => !finalFilter[filter].find((usr) => usr.key === item.key),
      ),
    ]);
  }, [filter, finalFilter, filterOptions]);

  useEffect(() => {
    menuOptions.map((item) => {
      if (item.id === filter) setOptionName(item.label);
    });
  }, [filter]);

  useEffect(() => {
    if (dueDate !== null && startDate !== null) {
      let currentFilter = { ...filteredData };
      Object.entries(currentFilter).forEach(([key, value]) => {
        if (key === 'taskDueDateOptions') {
          if (
            currentFilter[key].options &&
            currentFilter[key].options.length > 0
          ) {
            if (currentFilter[key].options.includes('DUE_DATE_RANGE')) {
              const index =
                currentFilter[key].options.indexOf('DUE_DATE_RANGE');
              currentFilter[key].options.splice(index, 1);
              currentFilter[key] = {
                dateStart: startDate,
                dateEnd: dueDate,
                options: currentFilter[key].options,
              };
            }
          }
        }
      });

      setFilteredData(currentFilter);
    }
  }, [dueDate, startDate, setStartDate, setDueDate]);

  const handleSelectOption = (item) => {
    inputRef.current.textContent = '';
    setFilterdUser((v) => v.filter((option) => option.key !== item.key));
    let currentFilter = { ...finalFilter };
    currentFilter[filter] = [
      ...currentFilter[filter],
      ...filterOptions.filter((user) => user.key === item.key),
    ];
    setFilter({ ...currentFilter });
  };

  const handleSearchOption = (e) => {
    setFilterdUser(
      filterOptions.filter((option) =>
        option.displayValue
          .toLowerCase()
          .includes(e.target.textContent.toLowerCase()),
      ),
    );
  };

  const handleRemoveAssign = (item) => {
    if (finalFilter[filter].find((user) => user.key === item.key)) {
      const urs = { ...finalFilter };
      urs[filter] = finalFilter[filter].filter(
        (option) => option.key !== item.key,
      );
      setFilter((v) => ({ ...urs }));
      setFilterdUser((v) => [...v, item]);
      let currentFilter = { ...finalFilter };
      currentFilter[filter] = currentFilter[filter].filter(
        (user) => user.key !== item.key,
      );
    }
  };

  const handleRemoveOption = () => {
    let currentFilter = { ...finalFilter };
    delete currentFilter[filter];
    setFilter({ ...currentFilter });
  };

  return (
    <>
      <div>
        <Title>{optionName}</Title>
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
                  {item.displayValue === 'Range' &&
                  item.key === 'DUE_DATE_RANGE' ? (
                    <DateRangeOptions
                      dueDate={dueDate}
                      setDueDate={setDueDate}
                      startDate={startDate}
                      setStartDate={setStartDate}
                    />
                  ) : (
                    <Lable>{item.displayValue}</Lable>
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
              contentEditable={true}
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
                  key={item.key}
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
                    <Lable>{item.displayValue}</Lable>
                  </DisplayValue>
                </OptionDropDownItem>
              ))}
            </OptionDropDown>
          </PopupContainer>
        )}
      </div>
    </>
  );
};

export default FilterSelect;

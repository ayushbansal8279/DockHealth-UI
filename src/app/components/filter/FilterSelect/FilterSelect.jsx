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
} from './style';
import UserAvatar from '../../user/UserAvatar/UserAvatar';

const FilterSelect = ({
  finalFilter,
  filterOptions,
  setFilter,
  filter,
  menuOptions,
  options,
  setOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [users, setUsers] = useState(filterOptions);
  const [filterdUser, setFilterdUser] = useState(filterOptions);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleSelectOption = (item) => {
    const urs = options;
    urs[filter] = [...options[filter], item];
    setOptions((v) => ({ ...urs }));
    inputRef.current.textContent = '';
    setFilterdUser((v) => v.filter((option) => option.key !== item.key));
    let currentFilter = { ...finalFilter };
    currentFilter[filter] = [
      ...currentFilter[filter],
      ...users.filter((user) => user.key === item.key),
    ];
    setFilter({ ...currentFilter });
  };

  const handleSearchOption = (e) => {
    if (e.target.textContent !== '') {
      setFilterdUser((item) =>
        item.filter((option) =>
          option.displayValue
            .toLowerCase()
            .startsWith(e.target.textContent.toLowerCase()),
        ),
      );
    } else {
      setFilterdUser(filterOptions);
    }
  };

  const handleRemoveAssign = (item) => {
    if (options[filter].find((user) => user.key === item.key)) {
      const urs = { ...options };
      urs[filter] = options[filter].filter((option) => option.key !== item.key);
      setOptions((v) => ({ ...urs }));
      setFilterdUser((v) => [...v, item]);
      let currentFilter = { ...finalFilter };
      currentFilter[filter] = currentFilter[filter].filter(
        (user) => user.key !== item.key,
      );
      setFilter({ ...currentFilter });
    }
  };

  const handleRemoveOption = () => {
    let currentFilter = { ...finalFilter };
    delete currentFilter[filter];
    setFilter({ ...currentFilter });
    const urs = options;
    delete urs[filter];
    setOptions(urs);
  };

  useEffect(() => {
    menuOptions.map((item) => {
      if (item.id === filter) setOptionName(item.label);
    });
  }, [filter]);

  return (
    <>
      <div>
        <Title>{optionName}</Title>
        <div ref={containerRef} style={{ display: 'flex' }}>
          <OptionHolder>
            {options[filter].map((item, i) => (
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
                  <Lable>{item.displayValue}</Lable>
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
        <Popover
          anchorEl={containerRef.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <OptionDropDown>
            {filterdUser.map((item, i) => (
              <OptionDropDownItem
                key={i}
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
        </Popover>
      </div>
    </>
  );
};

export default FilterSelect;

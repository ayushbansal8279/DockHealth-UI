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

const FilterSelect = ({
  finalFilter,
  filterOptions,
  setFilter,
  filter,
  menuOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [filterdUser, setFilterdUser] = useState(filterOptions);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

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
    if (e.target.textContent !== '') {
      setFilterdUser((item) =>
        item.filter((option) =>
          option.displayValue
            .toLowerCase()
            .includes(e.target.textContent.toLowerCase()),
        ),
      );
    } else {
      setFilterdUser(filterOptions);
    }
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

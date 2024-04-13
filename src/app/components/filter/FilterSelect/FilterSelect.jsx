import {
  CancelButton,
  ConfirmButton,
} from '@/app/modal/components/ModalButton/ModalButtons';
import { Button, Menu, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import CloseIcon from 'img/close_cross.svg';
import {
  AssigneDropDown,
  AssigneDropDownItem,
  AssigneHolder,
  AssigneInput,
  AssigneItem,
  BottomWrapper,
  FilterButtonWrapper,
  Title,
} from './style';
import { log } from '@/app/helpers/log';

const FilterSelect = ({
  finalFilter,
  filterOptions,
  setFilter,
  filter,
  menuOptions,
  assignedUser,
  setAssignedUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [users, setUsers] = useState(filterOptions);
  const [filterdUser, setFilterdUser] = useState(filterOptions);
  const assigneRef = useRef(null);

  const handleSelectAssigne = (item) => {
    const urs = assignedUser;
    urs[filter] = [...assignedUser[filter], item];
    setAssignedUser((v) => ({ ...urs }));
    assigneRef.current.textContent = '';
    setFilterdUser((v) => v.filter((assigne) => assigne.key !== item.key));
    let currentFilter = { ...finalFilter };
    currentFilter[filter] = [
      ...currentFilter[filter],
      ...users.filter((user) => user.key === item.key),
    ];
    setFilter({ ...currentFilter });
  };

  const handleSearchAssigne = (e) => {
    // .toLowerCase().localeCompare(e.target.textContent.toLowerCase())
    if (e.target.textContent !== '') {
      setFilterdUser((item) =>
        item.filter((assigne) =>
          assigne.displayValue
            .toLowerCase()
            .startsWith(e.target.textContent.toLowerCase()),
        ),
      );
    } else {
      setFilterdUser(filterOptions);
    }
  };

  const handleRemoveAssign = (item) => {
    if (assignedUser[filter].find((user) => user.key === item.key)) {
      const urs = { ...assignedUser };
      urs[filter] = assignedUser[filter].filter(
        (assigne) => assigne.key !== item.key,
      );
      setAssignedUser((v) => ({ ...urs }));
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
    const urs = assignedUser;
    delete urs[filter];
    setAssignedUser(urs);
  };

  useEffect(() => {
    menuOptions.map((item) => {
      if (item.id === filter) setOptionName(item.label);
    });
    // setFilterdUser(filterOptions);
  }, [filter]);

  return (
    <>
      <div>
        <Title>{optionName}</Title>
        <div style={{ display: 'flex' }}>
          <AssigneHolder>
            {assignedUser[filter].map((item, i) => (
              <AssigneItem key={i} contentEditable={false}>
                <div>{item.displayValue}</div>
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
              </AssigneItem>
            ))}
            <AssigneInput
              onClick={() => setIsOpen((v) => !v)}
              ref={assigneRef}
              contentEditable={true}
              onInput={(e) => handleSearchAssigne(e)}
            ></AssigneInput>
          </AssigneHolder>
          <div
            onClick={handleRemoveOption}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '5px',
              cursor: 'pointer',
            }}
          >
            {' '}
            <img src={CloseIcon} alt="close" />{' '}
          </div>
        </div>
        {isOpen && (
          <AssigneDropDown>
            {filterdUser.map((item, i) => (
              <AssigneDropDownItem
                key={i}
                onClick={() => handleSelectAssigne(item)}
              >
                {item.displayValue}
              </AssigneDropDownItem>
            ))}
          </AssigneDropDown>
        )}
      </div>
    </>
  );
};

export default FilterSelect;

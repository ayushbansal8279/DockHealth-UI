import React, { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import CloseIcon from 'img/close_cross.svg';
import * as OrganizationApi from '@/app/api/organization-api';
import { isUserGroup } from '@/app/helpers/user-helper';
import UserAvatar from '@/app/components/user/UserAvatar/UserAvatar';
import {
  OptionItem,
  DisplayValue,
  AvatarContainer,
  Lable,
} from '@/app/components/filter/FilterSelect/style';
import palette from '@/app/styles/palette';

const SingleUserPicker = ({
  value,
  onChange,
  placeholder,
  removedUserIdentifier,
}) => {
  const [allOptions, setAllOptions] = useState([]);

  useEffect(() => {
    OrganizationApi.getOrganizationUsersAndUserGroups()
      .then((organizationMembers) => {
        const usersOnly = organizationMembers.filter(
          (member) => !isUserGroup(member),
        );
        const mappedOptions = usersOnly.map((user) => ({
          key: user.identifier,
          displayValue: user.name || user.email,
          reference: user,
        }));
        setAllOptions(mappedOptions);
      })
      .catch(() => {});
  }, []);

  const selectedOption = useMemo(() => {
    if (!value) return null;
    return allOptions.find((option) => option.key === value) || null;
  }, [value, allOptions]);

  const activeUsersOptions = useMemo(() => {
    return allOptions
      .filter((option) => option?.reference?.userStatus === 'ACTIVE')
      .filter((option) => option.key !== removedUserIdentifier);
  }, [allOptions, removedUserIdentifier]);

  const handleChange = (event, newValue) => {
    const valueToChange = newValue?.at(-1) ?? null;
    if (valueToChange) {
      onChange(valueToChange.key);
    } else {
      onChange(null);
    }
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Autocomplete
          multiple
          limitTags={1}
          options={activeUsersOptions ?? []}
          disableCloseOnSelect
          getOptionLabel={(option) => option?.displayValue ?? ''}
          disabled={!!selectedOption}
          renderOption={(props, option) => (
            <>
              <li {...props}>
                <DisplayValue>
                  <AvatarContainer>
                    <UserAvatar user={option?.reference} />
                  </AvatarContainer>
                  <Lable
                    style={{
                      fontSize: '16px',
                      fontWeight: 400,
                      color: palette.black,
                    }}
                  >
                    {option?.displayValue}
                  </Lable>
                </DisplayValue>
              </li>
            </>
          )}
          renderTags={(value, getTagProps) =>
            value.map((item, index) => {
              const tagProps = getTagProps({ index });
              const itemProps = tagProps;
              return (
                <OptionItem {...itemProps} contentEditable={false}>
                  <DisplayValue>
                    <AvatarContainer>
                      <div style={{ paddingLeft: '10px' }}>
                        <UserAvatar user={item?.reference} />
                      </div>
                    </AvatarContainer>
                    <Lable
                      style={{
                        fontSize: '16px',
                        fontWeight: 400,
                        color: palette.black,
                      }}
                    >
                      {item?.displayValue}
                    </Lable>
                  </DisplayValue>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                  >
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
              );
            })
          }
          style={{ width: '517' }}
          value={selectedOption ? [selectedOption] : []}
          isOptionEqualToValue={(opt, val) => opt?.key === val?.key}
          onChange={handleChange}
          ListboxProps={{
            style: {
              maxHeight: '220px',
            },
          }}
          componentsProps={{
            popper: {
              style: {
                zIndex: 7000,
              },
              placement: 'bottom-start',
              modifiers: [
                {
                  name: 'preventOverflow',
                  enabled: true,
                  options: {
                    altBoundary: true,
                    rootBoundary: 'viewport',
                    padding: 8,
                  },
                },
                {
                  name: 'flip',
                  enabled: false,
                },
                {
                  name: 'offset',
                  enabled: true,
                  options: {
                    offset: [0, 4],
                  },
                },
                {
                  name: 'sameWidth',
                  enabled: true,
                  phase: 'beforeWrite',
                  requires: ['computeStyles'],
                  fn: ({ state }) => {
                    state.styles.popper.width = `${state.rects.reference.width}px`;
                  },
                  effect: ({ state }) => {
                    state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
                  },
                },
              ],
            },
            paper: {
              style: {
                width: '100%',
                maxWidth: '517px',
              },
            },
          }}
          renderInput={(params) => {
            return (
              <TextField
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: palette.whiteSmoke,
                    boxShadow: 'none',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: `2px solid ${palette.crystalBlue}`,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: palette.crystalBlue,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: palette.crystalBlue,
                    },

                    '& .MuiInputBase-input': {
                      background: 'transparent',
                      border: 0,
                      boxShadow: 'none',
                      outline: 0,
                      fontSize: '16px',
                      fontWeight: 400,
                      color: palette.black,
                    },

                    '& .MuiInputBase-input::placeholder': {
                      color: palette.coolGrey1,
                      opacity: 1,
                      fontWeight: 400,
                      fontSize: '16px',
                    },
                  },
                }}
                placeholder={
                  selectedOption
                    ? ''
                    : placeholder || 'Search user to reassign tasks'
                }
                {...params}
              />
            );
          }}
        />
      </div>
    </div>
  );
};

export default SingleUserPicker;

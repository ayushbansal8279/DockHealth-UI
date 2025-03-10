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
  PatientOptionsContainer,
  PatientName,
  PatientTableHeader,
} from './style';
import UserAvatar from '../../user/UserAvatar/UserAvatar';
import DateRangeOptions from '../DateRangeOptions/DateRangeOptions';
import debounce from 'lodash.debounce';
import { getPatientsByCriteria } from '@/app/api/patients-api';
import { mapPatientsToOptions, TextFieldSX } from './helper';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper';
import { useSelector } from 'react-redux';
import { organizationSelector } from '@/app/selectors/organization-selectors';

const FilterSelect = ({
  finalFilter,
  filterOptions,
  setFinalFilter,
  filter,
  filters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [options, setOptions] = useState(
    filter !== 'patients' ? filterOptions : [],
  );
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [isDateRange, setIsDateRange] = useState(false);
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const { emrIntegrationType } = useSelector(organizationSelector) || {};
  const patientPlaceholder =
    emrIntegrationType === 'FHIR'
      ? `Search ${customerTypeLabel} (MRN #)`
      : `Search ${customerTypeLabel} (first last or last, first)`;
  const isPatient = filter === `${customerTypeLabel}s`;

  useEffect(() => {
    if (!isPatient) {
      setOptions([
        ...filterOptions.filter(
          (item) => !finalFilter[filter].find((usr) => usr?.key === item?.key),
        ),
      ]);
    }
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
        if (item?.dateStart && item?.dateEnd) {
          setDateStart(item?.dateStart);
          setDateEnd(item?.dateEnd);
        }
      }
    });
  }, [finalFilter]);

  useEffect(() => {
    if (dueDate !== null && startDate !== null) {
      let currentFinalFilter = { ...finalFilter };
      currentFinalFilter[filter]?.map((item, index) => {
        if (item?.key?.includes('DATE_RANGE')) {
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
    setOptions((v) => v.filter((option) => option?.key !== item?.key));
    let currentFilter = { ...finalFilter };
    const allFilterOptions = isPatient ? options : filterOptions;
    currentFilter[filter] = [
      ...currentFilter[filter],
      ...allFilterOptions.filter((option) => option?.key === item?.key),
    ];
    setFinalFilter({ ...currentFilter });
  };

  const handleSearchOption = (e) => {
    if (!isPatient) {
      setOptions(
        filterOptions.filter((option) =>
          option?.displayValue
            .toLowerCase()
            .includes(e.target.textContent.toLowerCase()),
        ),
      );
    }
  };

  const handleRemoveSelectedOption = (item) => {
    if (finalFilter[filter].find((option) => option.key === item?.key)) {
      const currentFilter = { ...finalFilter };
      currentFilter[filter] = finalFilter[filter].filter(
        (option) => option?.key !== item?.key,
      );
      setFinalFilter(() => ({ ...currentFilter }));
      setOptions((v) => [...v, item]);
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

  const fetchPatientsWithDebounce = debounce((mentionString) => {
    if (mentionString) {
      getPatientsByCriteria(mentionString).then((fetchedPatients) => {
        const formattedPatients = mapPatientsToOptions(fetchedPatients);
        setOptions(formattedPatients);
      });
    }
  }, 300);

  return (
    <>
      <div>
        <Title>{optionName}</Title>
        {!isDateRange ? (
          <div style={{ display: 'flex' }}>
            <Autocomplete
              multiple
              options={options}
              disableCloseOnSelect
              getOptionLabel={(option) => option?.displayValue}
              renderOption={(props, option) => (
                <>
                  {isPatient && options && options[0]?.key === option?.key && (
                    <PatientOptionsContainer>
                      <PatientTableHeader>Patient Name</PatientTableHeader>
                      <PatientTableHeader>DOB</PatientTableHeader>
                      <PatientTableHeader>MRN</PatientTableHeader>
                    </PatientOptionsContainer>
                  )}
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
                      {!isPatient ? (
                        <Lable>{option?.displayValue}</Lable>
                      ) : (
                        <PatientOptionsContainer>
                          <PatientName>{option?.displayValue}</PatientName>
                          <PatientName>{option?.dob}</PatientName>
                          <PatientName>{option?.mrn}</PatientName>
                        </PatientOptionsContainer>
                      )}
                    </DisplayValue>
                  </li>
                </>
              )}
              style={{ width: '517' }}
              value={finalFilter[filter]}
              onChange={(event, newValue, action, option) => {
                if (action === 'selectOption') {
                  handleSelectOption(option.option);
                }
                if (action === 'removeOption') {
                  handleRemoveSelectedOption(option.option);
                }
                if (action === 'clear') {
                  handleRemoveOption();
                }
              }}
              renderInput={(params) => (
                <TextField
                  onChange={(e) => {
                    if (isPatient) fetchPatientsWithDebounce(e.target.value);
                  }}
                  sx={TextFieldSX}
                  placeholder={
                    isPatient && options.length === 0 && patientPlaceholder
                  }
                  {...params}
                />
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
                  {options.map((item, i) => (
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

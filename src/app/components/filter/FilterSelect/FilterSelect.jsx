import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CloseIcon from 'img/close_cross.svg';
import {
  OptionItem,
  Title,
  DisplayValue,
  AvatarContainer,
  Lable,
  CloseIconContainer,
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
import SingleDateOption from '../DateRangeOptions/SingleDateOption';
import NumberRangeOptions from '../NumberRangeOptions/NumberRangeOptions';
import SingleNumberOption from '../NumberRangeOptions/SingleNumberOption';

const FilterSelect = ({
  finalFilter,
  filterOptions,
  setFinalFilter,
  filter,
  filters,
}) => {
  const [optionName, setOptionName] = useState('');
  const [options, setOptions] = useState(
    filter !== 'patients' ? filterOptions : [],
  );
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [date, setDate] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [minNumber, setMinNumber] = useState(null);
  const [maxNumber, setMaxNumber] = useState(null);
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [singleNumber, setSingleNumber] = useState(null);
  const [numberValue, setNumberValue] = useState(null);
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
    let foundDateRange = false;
    let foundSingleDate = false;

    finalFilter[filter].forEach((item) => {
      if (item?.key?.includes('DATE_RANGE')) {
        foundDateRange = true;
        if (item?.dateStart && item?.dateEnd) {
          setDateStart(item?.dateStart);
          setDateEnd(item?.dateEnd);
        }
      }

      if (item?.key?.includes('DATE_SINGLE')) {
        foundSingleDate = true;
        if (item?.date) {
          setDateValue(item?.date);
        } else {
          setDateValue('');
        }
      }
    });

    if (!foundDateRange) {
      setDateStart('');
      setDateEnd('');
    }
    if (!foundSingleDate) {
      setDateValue('');
    }
  }, [finalFilter, filter]);

  useEffect(() => {
    let foundNumberRange = false;
    let foundSingleNumber = false;

    finalFilter[filter].forEach((item) => {
      if (item?.key?.includes('NUMBER_RANGE')) {
        foundNumberRange = true;
        if (item?.minValue !== undefined && item?.maxValue !== undefined) {
          setMinValue(item?.minValue);
          setMaxValue(item?.maxValue);
        }
      }

      if (item?.key?.includes('SINGLE_NUMBER')) {
        foundSingleNumber = true;
        if (item?.value !== undefined) {
          setNumberValue(item?.value);
        } else {
          setNumberValue(null);
        }
      }
    });

    if (!foundNumberRange) {
      setMinValue(null);
      setMaxValue(null);
    }
    if (!foundSingleNumber) {
      setNumberValue(null);
    }
  }, [finalFilter, filter]);

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

  useEffect(() => {
    if (date !== null) {
      let currentFinalFilter = { ...finalFilter };
      currentFinalFilter[filter]?.map((item, index) => {
        if (item?.key?.includes('DATE_SINGLE')) {
          currentFinalFilter[filter][index] = {
            ...currentFinalFilter[filter][index],
            date: date,
          };
        }
      });
      setFinalFilter({ ...currentFinalFilter });
    }
  }, [date, setDate]);

  useEffect(() => {
    if (minNumber !== null || maxNumber !== null) {
      let currentFinalFilter = { ...finalFilter };
      currentFinalFilter[filter]?.map((item, index) => {
        if (item?.key?.includes('NUMBER_RANGE')) {
          currentFinalFilter[filter][index] = {
            ...currentFinalFilter[filter][index],
            minValue: minNumber,
            maxValue: maxNumber,
          };
        }
      });
      setFinalFilter({ ...currentFinalFilter });
    }
  }, [minNumber, maxNumber, setMinNumber, setMaxNumber]);

  useEffect(() => {
    if (singleNumber !== null) {
      let currentFinalFilter = { ...finalFilter };
      currentFinalFilter[filter]?.map((item, index) => {
        if (item?.key?.includes('SINGLE_NUMBER')) {
          currentFinalFilter[filter][index] = {
            ...currentFinalFilter[filter][index],
            value: singleNumber,
          };
        }
      });
      setFinalFilter({ ...currentFinalFilter });
    }
  }, [singleNumber, setSingleNumber]);

  const handleSelectOption = (item) => {
    setOptions((v) => v.filter((option) => option?.key !== item?.key));
    let currentFilter = { ...finalFilter };
    const allFilterOptions = isPatient ? options : filterOptions;
    currentFilter[filter] = [
      ...currentFilter[filter],
      ...allFilterOptions.filter((option) => option?.key === item?.key),
    ];
    setFinalFilter({ ...currentFilter });
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
            renderTags={(value, getTagProps) =>
              value.map((item, index) => {
                const isDateRangeItem = item?.key?.includes('DATE_RANGE');
                const isSingleDateItem = item?.key?.includes('DATE_SINGLE');
                const isNumberRangeItem = item?.key?.includes('NUMBER_RANGE');
                const isSingleNumberItem = item?.key?.includes('SINGLE_NUMBER');
                const isDateItem = isDateRangeItem || isSingleDateItem;
                const isNumberItem = isNumberRangeItem || isSingleNumberItem;
                const isSpecialItem = isDateItem || isNumberItem;
                const tagProps = getTagProps({ index });

                const itemProps = isSpecialItem
                  ? {
                      key: tagProps.key,
                      onMouseDown: (e) => {
                        e.stopPropagation();
                      },
                      onClick: (e) => {
                        e.stopPropagation();
                      },
                    }
                  : tagProps;

                return (
                  <OptionItem {...itemProps} contentEditable={false}>
                    <DisplayValue>
                      {isDateRangeItem ? (
                        <div style={{ paddingLeft: '15px' }}>
                          <DateRangeOptions
                            dueDate={dueDate}
                            setDueDate={setDueDate}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            dateEnd={dateEnd}
                            dateStart={dateStart}
                          />
                        </div>
                      ) : isSingleDateItem ? (
                        <div style={{ paddingLeft: '15px' }}>
                          <SingleDateOption
                            date={dateValue}
                            setDate={setDate}
                          />
                        </div>
                      ) : isNumberRangeItem ? (
                        <div style={{ paddingLeft: '15px' }}>
                          <NumberRangeOptions
                            minNumber={minNumber}
                            setMinNumber={setMinNumber}
                            maxNumber={maxNumber}
                            setMaxNumber={setMaxNumber}
                            minValue={minValue}
                            maxValue={maxValue}
                          />
                        </div>
                      ) : isSingleNumberItem ? (
                        <div style={{ paddingLeft: '15px' }}>
                          <SingleNumberOption
                            value={numberValue}
                            setNumber={setSingleNumber}
                          />
                        </div>
                      ) : (
                        <>
                          <AvatarContainer>
                            {(optionName === 'Assigned by' ||
                              optionName === 'Assigned to') && (
                              <div style={{ paddingLeft: '10px' }}>
                                <UserAvatar user={item?.reference} />
                              </div>
                            )}
                          </AvatarContainer>
                          <Lable>{item?.displayValue}</Lable>
                        </>
                      )}
                    </DisplayValue>
                    <div onClick={() => handleRemoveSelectedOption(item)}>
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
      </div>
    </>
  );
};

export default FilterSelect;

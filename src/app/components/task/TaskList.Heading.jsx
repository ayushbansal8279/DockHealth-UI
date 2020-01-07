import React from 'react';

import { SORTING_KEYS } from './TaskList.Data';
import OrderIcon from './TaskList.OrderIcon';
import {
  HeadingAssignedToContainer,
  HeadingContainer,
  HeadingDueDateContainer,
  HeadingPatientContainer,
  HeadingStatusContainer,
  HeadingTaskContainer,
} from './TaskList.styled';

const Heading = ({ onSortingChanged, taskDrawerOpen, sorting }) => (
  <HeadingContainer>
    <HeadingAssignedToContainer
      onClick={onSortingChanged({ key: SORTING_KEYS.ASSIGNED_TO })}
    >
      <span>ASSIGNED</span>
      <OrderIcon sortingKey={SORTING_KEYS.ASSIGNED_TO} sorting={sorting} />
    </HeadingAssignedToContainer>
    <HeadingTaskContainer
      onClick={onSortingChanged({ key: SORTING_KEYS.TASK })}
    >
      <span>TASK</span>
      <OrderIcon sortingKey={SORTING_KEYS.TASK} sorting={sorting} />
    </HeadingTaskContainer>
    {!taskDrawerOpen && (
      <HeadingPatientContainer
        onClick={onSortingChanged({ key: SORTING_KEYS.PATIENT })}
      >
        <span>PATIENT</span>
        <OrderIcon sortingKey={SORTING_KEYS.PATIENT} sorting={sorting} />
      </HeadingPatientContainer>
    )}
    {!taskDrawerOpen && (
      <HeadingDueDateContainer
        style={{ cursor: 'pointer', width: '180px' }}
        onClick={onSortingChanged({ key: SORTING_KEYS.DUE_DATE })}
      >
        <span>DUE</span>
        <OrderIcon sortingKey={SORTING_KEYS.DUE_DATE} sorting={sorting} />
      </HeadingDueDateContainer>
    )}
    {!taskDrawerOpen && (
      <HeadingStatusContainer
        onClick={onSortingChanged({ key: SORTING_KEYS.STATUS })}
      >
        <span>STATUS</span>
        <OrderIcon sortingKey={SORTING_KEYS.STATUS} sorting={sorting} />
      </HeadingStatusContainer>
    )}
  </HeadingContainer>
);

export default Heading;

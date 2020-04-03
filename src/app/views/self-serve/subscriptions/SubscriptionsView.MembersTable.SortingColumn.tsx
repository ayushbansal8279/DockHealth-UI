import { Grid } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { RotatableChevronWithSpacing } from '../../../components/common/RotatableChevron';
import palette from '../../../palette';
import { MontserratTypography } from '../../../theme-montserrat';

export enum SORTING_PROPERTIES {
  NAME,
  USER_TYPE,
  JOINED,
  SUBSCRIPTION,
}

type Nullable<T> = T | null;

interface UserType {
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  orgUserRole: Nullable<string>;
  registrationDate: Nullable<string>;
}

export const SORTING_PROPERTIES_PREDICATES = {
  [SORTING_PROPERTIES.NAME]: (user: UserType) =>
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
  [SORTING_PROPERTIES.USER_TYPE]: (user: UserType) => user?.orgUserRole ?? '',
  [SORTING_PROPERTIES.JOINED]: (user: UserType) => user?.registrationDate ?? '',
  [SORTING_PROPERTIES.SUBSCRIPTION]: () => '',
};

interface SortingColumnProps {
  children: React.ReactNode;
  currentSortingProperty: SORTING_PROPERTIES;
  sortingProperty: SORTING_PROPERTIES;
  setSortingProperty: (property: SORTING_PROPERTIES) => void;
  currentSortingOrder: 'asc' | 'desc';
}

const SortingColumnContainer = styled.div`
  cursor: pointer;
`;

const SortingColumn = ({
  children,
  currentSortingProperty,
  sortingProperty,
  setSortingProperty,
  currentSortingOrder,
}: SortingColumnProps) => (
  <SortingColumnContainer onClick={() => setSortingProperty(sortingProperty)}>
    <Grid container alignItems="center" direction="row" wrap="nowrap">
      <span>
        <MontserratTypography variant="h4">{children}</MontserratTypography>
      </span>
      {currentSortingProperty === sortingProperty && (
        <RotatableChevronWithSpacing
          color={palette.brightBlue}
          rotated={currentSortingOrder === 'desc'}
        />
      )}
    </Grid>
  </SortingColumnContainer>
);

export default SortingColumn;

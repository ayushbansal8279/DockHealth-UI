import { Grid } from '@material-ui/core';
import moment from 'moment';
import ascend from 'ramda/src/ascend';
import descend from 'ramda/src/descend';
import head from 'ramda/src/head';
import isEmpty from 'ramda/src/isEmpty';
import prop from 'ramda/src/prop';
import sort from 'ramda/src/sort';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ListSkeletonLoader from 'components/common/ListSkeletonLoader/ListSkeletonLoader';
import SortingIcon from 'img/sorting-icon.svg';
import { MontserratTypography } from 'styles/theme-montserrat';
import Spacing from 'components/common/Spacing';
import { organizationSelector } from 'selectors/organization-selectors';
import {
  ChargeDetailsLink,
  InvoiceColumn,
  InvoiceColumnInnerContainer,
  InvoicesListContainer,
  InvoicesTable,
  SortingIconContainer,
  SortingIconImage,
  ListLoaderContainer,
} from './styled';

const columnDefinitions = [
  {
    sortingKey: 'chargeDate',
    label: 'Date',
  },
  {
    sortingKey: 'invoiceNumber',
    label: 'Invoice Number',
  },
  {
    sortingKey: 'receiptNumber',
    label: 'Receipt Number',
  },
  {
    sortingKey: 'chargeAmount',
    label: 'Amount',
  },
];

const renderInvoiceRow = ({
  chargeDate,
  invoiceNumber,
  receiptNumber,
  chargeAmount,
  currency,
  invoicePDFUrl,
  receiptUrl,
}) => {
  return (
    <tr key={invoiceNumber}>
      <td>{moment(chargeDate).format('L')}</td>
      <td>
        {invoicePDFUrl ? (
          <ChargeDetailsLink
            href={invoicePDFUrl}
            target="_blank"
            title="Download invoice"
          >
            {invoiceNumber ?? 'Invoice'}
          </ChargeDetailsLink>
        ) : (
          'N/A'
        )}
      </td>
      <td>
        {receiptUrl ? (
          <ChargeDetailsLink
            href={receiptUrl}
            target="_blank"
            title="Preview receipt"
          >
            {receiptNumber ?? 'Receipt'}
          </ChargeDetailsLink>
        ) : (
          'N/A'
        )}
      </td>
      <td>
        ${chargeAmount} {currency?.toUpperCase()}
      </td>
    </tr>
  );
};

const renderColumn = ({ currentSorting, setCurrentSorting }) => ({
  sortingKey,
  label,
}) => {
  return (
    <InvoiceColumn
      key={sortingKey}
      onClick={() => setCurrentSorting({ newSortingKey: sortingKey })}
    >
      <InvoiceColumnInnerContainer>
        <MontserratTypography variant="h4">
          {label?.toUpperCase()}
        </MontserratTypography>
        {currentSorting.sortingKey === sortingKey && (
          <SortingIconContainer>
            <SortingIconImage
              rotated={currentSorting.order === 'asc'}
              src={SortingIcon}
              alt="sorting icon"
            />
          </SortingIconContainer>
        )}
      </InvoiceColumnInnerContainer>
    </InvoiceColumn>
  );
};

const defaultSorting = { ...head(columnDefinitions), order: 'desc' };

const setCurrentSortingWithKey = ({ currentSorting, setCurrentSorting }) => ({
  newSortingKey,
}) => {
  const newSorting = columnDefinitions.find(
    ({ sortingKey }) => newSortingKey === sortingKey,
  );

  if (newSorting) {
    if (newSorting.sortingKey === currentSorting.sortingKey) {
      newSorting.order = currentSorting.order === 'desc' ? 'asc' : 'desc';
    } else {
      newSorting.order = 'desc';
    }

    setCurrentSorting({ ...newSorting });
  } else {
    setCurrentSorting({ ...defaultSorting });
  }
};

const InvoicesList = () => {
  const [currentSorting, setCurrentSorting] = useState(defaultSorting);

  const { invoiceDetails } = useSelector(organizationSelector);

  const invoiceOrderMethod = currentSorting.order === 'asc' ? ascend : descend;
  const sortedInvoicesData = invoiceDetails
    ? sort(invoiceOrderMethod(prop(currentSorting.sortingKey)), invoiceDetails)
    : [];

  return (
    <InvoicesListContainer>
      <Spacing vertical={4} />
      <MontserratTypography variant="h3">INVOICES</MontserratTypography>
      <Spacing vertical={4} />
      {invoiceDetails ? (
        <InvoicesTable>
          <thead>
            <tr>
              {columnDefinitions.map(
                renderColumn({
                  currentSorting,
                  setCurrentSorting: setCurrentSortingWithKey({
                    setCurrentSorting,
                    currentSorting,
                  }),
                }),
              )}
            </tr>
          </thead>
          <tbody>
            {isEmpty(sortedInvoicesData) ? (
              <tr>
                <td colSpan={columnDefinitions.length}>
                  <Grid container justify="center" alignItems="center">
                    No invoices found
                  </Grid>
                </td>
              </tr>
            ) : (
              sortedInvoicesData.map(renderInvoiceRow)
            )}
          </tbody>
        </InvoicesTable>
      ) : (
        <ListLoaderContainer>
          <ListSkeletonLoader header rows={10} />
        </ListLoaderContainer>
      )}
    </InvoicesListContainer>
  );
};

export default InvoicesList;

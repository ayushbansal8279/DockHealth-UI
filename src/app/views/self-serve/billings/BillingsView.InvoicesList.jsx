import { Grid } from '@material-ui/core';
import moment from 'moment';
import { ascend, descend, head, isEmpty, prop, sort } from 'ramda';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CubesLoader from '../../../components/common/CubesLoader';
import SortingIcon from '../../../img/sorting-icon.svg';
import {
  ChargeDetailsLink,
  InvoiceColumn,
  InvoiceColumnInnerContainer,
  InvoicesListContainer,
  InvoicesTable,
  SortingIconContainer,
  SortingIconImage,
} from './BillingsView.InvoicesList.Styled';
import { MontserratTypography } from '../../../theme-montserrat';
import Spacing from '../../../components/common/Spacing';

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
        ${chargeAmount} {currency.toUpperCase()}
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

  const { invoiceDetails } = useSelector(store => ({
    invoiceDetails: store.organizationState.invoiceDetails,
  }));

  const invoiceOrderMethod = currentSorting.order === 'asc' ? ascend : descend;
  const sortedInvoicesData = invoiceDetails
    ? sort(invoiceOrderMethod(prop(currentSorting.sortingKey)), invoiceDetails)
    : [];

  console.info(sortedInvoicesData);

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
        <Grid container justify="center">
          <CubesLoader size={48} />
        </Grid>
      )}
    </InvoicesListContainer>
  );
};

export default InvoicesList;

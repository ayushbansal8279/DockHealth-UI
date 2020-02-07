import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import { isEmpty, head } from 'ramda';
// import ascend from 'ramda/es/ascend';
// import descend from 'ramda/es/descend';
// import prop from 'ramda/es/prop';
// import sort from 'ramda/es/sort';
// import times from 'ramda/es/times';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSetState } from 'react-use';
import useBoolean from '../../../hooks/useBoolean';
import SortingIcon from '../../../img/sorting-icon.svg';
import InvoicePreview from './BillingsView.InvoicePreview';
import {
  ChargeDetailsLink,
  InvoiceColumn,
  InvoiceColumnInnerContainer,
  InvoicesListContainer,
  InvoicesTable,
  SortingIconContainer,
  SortingIconImage,
} from './BillingsView.InvoicesList.Styled';

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

const renderInvoiceRow = ({ openPdfPreview }) => ({
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
        <ChargeDetailsLink
          onClick={openPdfPreview({
            url: invoicePDFUrl,
            label: 'Invoice',
            numberLabel: invoiceNumber,
          })}
        >
          {invoiceNumber}
        </ChargeDetailsLink>
      </td>
      <td>
        <ChargeDetailsLink
          onClick={openPdfPreview({
            url: receiptUrl,
            label: 'Receipt',
            numberLabel: receiptNumber,
          })}
        >
          {receiptNumber}
        </ChargeDetailsLink>
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
        <span>{label}</span>
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

const InvoicesList = () => {
  const [currentSorting, setCurrentSorting] = useState(defaultSorting);
  const [isPreviewOpen, openPreview, hidePreview] = useBoolean(false);

  const [previewState, setPreviewState] = useSetState({
    url: null,
    label: null,
    numberLabel: null,
  });

  const openPdfPreview = useCallback(
    ({ url, label, numberLabel }) => {
      setPreviewState({
        url,
        label,
        numberLabel,
      });

      openPreview();
    },
    [openPreview, setPreviewState],
  );

  const setCurrentSortingWithKey = ({ newSortingKey }) => {
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

  const { invoiceDetails } = useSelector(store => ({
    invoiceDetails: store.organizationState.invoiceDetails,
  }));

  // const invoiceOrderMethod = currentSorting.order === 'asc' ? ascend : descend;
  // const sortedInvoicesData = sort(
  //   invoiceOrderMethod(prop(currentSorting.sortingKey)),
  //   invoiceDetails,
  // );

  const sortedInvoicesData = invoiceDetails || [];

  return (
    <InvoicesListContainer>
      <InvoicesTable>
        <thead>
          <tr>
            {columnDefinitions.map(
              renderColumn({
                currentSorting,
                setCurrentSorting: setCurrentSortingWithKey,
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
            sortedInvoicesData.map(renderInvoiceRow({ openPdfPreview }))
          )}
        </tbody>
      </InvoicesTable>
      <InvoicePreview
        isPreviewOpen={isPreviewOpen}
        hidePreview={hidePreview}
        {...previewState}
      />
    </InvoicesListContainer>
  );
};

export default InvoicesList;

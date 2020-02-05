// import faker from 'faker/locale/en_US';
import moment from 'moment';
// import ascend from 'ramda/es/ascend';
// import descend from 'ramda/es/descend';
import head from 'ramda/es/head';
// import prop from 'ramda/es/prop';
// import sort from 'ramda/es/sort';
// import times from 'ramda/es/times';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import SortingIcon from '../../../img/sorting-icon.svg';
import {
  InvoiceColumn,
  InvoiceColumnInnerContainer,
  InvoicesListContainer,
  InvoicesTable,
  SortingIconContainer,
  SortingIconImage,
} from './BillingsView.InvoicesList.Styled';

export const InvoiceDetailsLink = styled.a`
  color: #007cab;
  cursor: pointer;
  filter: brightness(1);
  transition: all 0.25s ease-out;

  &:hover {
    color: #007cab;
    filter: brightness(1.35);
  }
`;

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

// const dummyInvoicesData = times(
//   () => ({
//     date: moment(faker.date.recent(180)).format('YYYY-MM-DD'),
//     description: faker.lorem.words(faker.random.number({ min: 3, max: 5 })),
//     id: faker.random.uuid(),
//     amount: faker.finance.amount(10, 1000, 2, '$'),
//   }),
//   faker.random.number({ min: 5, max: 15 }),
// );

const renderInvoiceRow = ({
  chargeDate,
  invoiceNumber,
  receiptNumber,
  chargeAmount,
  currency,
  invoicePDFUrl,
}) => {
  return (
    <tr key={invoiceNumber}>
      <td>{moment(chargeDate).format('L')}</td>
      <td>
        <InvoiceDetailsLink href={invoicePDFUrl}>
          {invoiceNumber}
        </InvoiceDetailsLink>
      </td>
      <td>{receiptNumber}</td>
      <td>
        {chargeAmount} {currency.toUpperCase()}
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
        <tbody>{sortedInvoicesData.map(renderInvoiceRow)}</tbody>
      </InvoicesTable>
    </InvoicesListContainer>
  );
};

export default InvoicesList;

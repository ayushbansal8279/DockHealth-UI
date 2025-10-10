import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { MontserratTypography } from 'styles/theme-montserrat';
import { invoiceDetailsSelector } from 'selectors/organization-selectors';
import ReusableDataGrid from 'components/custom-profile/CustomProfilesList/DataGrid/DataGrid';
import { InvoicesListContainer, ChargeDetailsLink } from './styled';
import moment from 'moment';

const InvoicesList = () => {
  const invoiceDetails = useSelector(invoiceDetailsSelector);

  const columns = useMemo(
    () => [
      {
        field: 'chargeDate',
        headerName: 'DATE',
        flex: 1,
        sortable: true,
        renderCell: (params) => moment(params.value).format('L'),
      },
      {
        field: 'invoiceNumber',
        headerName: 'INVOICE NUMBER',
        flex: 1,

        sortable: true,
        renderCell: (params) => {
          const { invoicePDFUrl, invoiceNumber } = params.row;
          return invoicePDFUrl ? (
            <ChargeDetailsLink
              href={invoicePDFUrl}
              target="_blank"
              title="Download invoice"
            >
              {invoiceNumber ?? 'Invoice'}
            </ChargeDetailsLink>
          ) : (
            'N/A'
          );
        },
      },
      {
        field: 'receiptNumber',
        headerName: 'RECEIPT NUMBER',
        flex: 1,

        sortable: true,
        renderCell: (params) => {
          const { receiptUrl, receiptNumber } = params.row;
          return receiptUrl ? (
            <ChargeDetailsLink
              href={receiptUrl}
              target="_blank"
              title="Preview receipt"
            >
              {receiptNumber ?? 'Receipt'}
            </ChargeDetailsLink>
          ) : (
            'N/A'
          );
        },
      },
      {
        field: 'chargeAmount',
        headerName: 'AMOUNT',
        flex: 1,
        sortable: true,
        renderCell: (params) => {
          const { chargeAmount, currency } = params.row;
          return `$${chargeAmount} ${currency?.toUpperCase()}`;
        },
      },
    ],
    [],
  );

  const rows = useMemo(() => {
    if (!invoiceDetails) return [];

    return invoiceDetails.map((invoice, index) => ({
      id: invoice.invoiceNumber || `invoice-${index}`,
      ...invoice,
    }));
  }, [invoiceDetails]);

  return (
    <InvoicesListContainer>
      <MontserratTypography variant="h3">INVOICES</MontserratTypography>
      <InvoicesListContainer>
        <ReusableDataGrid
          columns={columns}
          rows={rows}
          loading={!invoiceDetails}
          initialState={{
            sorting: {
              sortModel: [{ field: 'chargeDate', sort: 'desc' }],
            },
          }}
          showSearch={false}
        />
      </InvoicesListContainer>
    </InvoicesListContainer>
  );
};

export default InvoicesList;

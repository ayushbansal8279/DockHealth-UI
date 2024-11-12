import LayoutHeader from '@/app/components/template/LayoutHeader/LayoutHeader'
import ViewLayout from '@/app/components/template/ViewLayout/ViewLayout'
import { Box, Grid } from '@mui/material'
import React from 'react'
import ImportStatusGrid from './ImportStatusGrid'
import { userProfileSelector } from '@/app/selectors/user-selectors'
import { useSelector } from 'react-redux'
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper'
import { capitalize } from 'helpers/capitalize';

export default function PatientImportStatus() {

  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  return (
    <ViewLayout>
      <LayoutHeader>
      <LayoutHeader.Title
        title={`${customerTypeLabelCapitalized} Import Tracking`}
        description=""
      />
      </LayoutHeader>
      <ImportStatusGrid/>
    </ViewLayout>
  )
}


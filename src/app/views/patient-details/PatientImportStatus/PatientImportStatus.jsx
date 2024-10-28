import LayoutHeader from '@/app/components/template/LayoutHeader/LayoutHeader'
import ViewLayout from '@/app/components/template/ViewLayout/ViewLayout'
import { Box, Grid } from '@mui/material'
import React from 'react'
import ImportStatusGrid from './ImportStatusGrid'

export default function PatientImportStatus() {

  return (
    <ViewLayout>
      <LayoutHeader>
      <LayoutHeader.Title
        title="Patient Import Tracking"
        description=""
      />
      </LayoutHeader>
      <ImportStatusGrid/>
    </ViewLayout>
  )
}


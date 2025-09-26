import { getUserActivity, getUserById } from '@/app/api/user-api';
import LayoutHeader from '@/app/components/template/LayoutHeader/LayoutHeader'
import ViewLayout from '@/app/components/template/ViewLayout/ViewLayout'
import { Box, Grid, Tooltip } from '@mui/material';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import ArrowLeftIcon from 'img/arrow-left.svg';
import { BackButtonContainer, EventDurationContainer, StyledDataGrid, UserName} from './styled';
import { GridToolbar, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import ReusableDataGrid from '@/app/components/custom-profile/CustomProfilesList/DataGrid/DataGrid';

const UserActivity = () => {
  const history = useHistory();
  const { userIdentifier } = useParams();
  const [rows, setRows] = useState([]);
  const [userDetails, setUserDetails] = useState();

  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  useEffect(() => {
    const fetchDataAndRender = async () => {
      const fromDateTime = moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD HH:mm:ss');
      const toDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      try {
        const userDetailsResponse = await getUserById(userIdentifier);
        setUserDetails(userDetailsResponse);
        const response = await getUserActivity(
          userIdentifier,
          fromDateTime,
          toDateTime,
        );
        const processedData = [...response]
          .sort((a, b) => new Date(b.eventDateTime) - new Date(a.eventDateTime))
          .map((item, index) => ({
            id: index,
            eventDateTime: item.eventDateTime,
            eventAction: item.eventAction,
            eventCategory: item.eventCategory,
            usageEventType: item.usageEventType,
          }));
        setRows(processedData);
      } catch (error) {
        console.error('Error fetching user activity:', error);
      }
    };
    fetchDataAndRender();
  }, [userIdentifier]);

  const defaultColumns = [
    {
      field: 'eventDateTime',
      headerName: 'EVENT DATE/TIME',
      width: 250,
      renderCell: ({ row }) => {
        const formattedDate = `${moment(row.eventDateTime).format(
          'MMM DD, YYYY',
        )} @ ${moment(row.eventDateTime).format('hh:mm a')}`;
        return (
          <Tooltip placement="top" title={formattedDate}>
            <span>{formattedDate}</span>
          </Tooltip>
        );
      },
      editable: false,
      align: 'left',
      headerAlign: 'left',
      filterable: true,
    },
    {
      field: 'usageEventType',
      headerName: 'EVENT TYPE',
      width: 230,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={row.usageEventType}>
          <span>{row.usageEventType}</span>
        </Tooltip>
      ),
      editable: false,
      align: 'left',
      headerAlign: 'left',
      filterable: true,
    },
    {
      field: 'eventCategory',
      headerName: 'EVENT CATEGORY',
      width: 220,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={row.eventCategory}>
          <span>{row.eventCategory}</span>
        </Tooltip>
      ),
      editable: false,
      align: 'left',
      headerAlign: 'left',
      filterable: true,
    },
    {
      field: 'eventAction',
      headerName: 'EVENT ACTION',
      width: 450,
      renderCell: ({ row }) => (
        <Tooltip placement="top" title={row.eventAction}>
          <span>{row.eventAction}</span>
        </Tooltip>
      ),
      editable: false,
      align: 'left',
      headerAlign: 'left',
      filterable: true,
    },
  ];

  return (
    <ViewLayout>
      <LayoutHeader>
        <LayoutHeader.Title title={`User Activity`} description="" />
      </LayoutHeader>

      <BackButtonContainer>
        <Box>
          <button type="button" onClick={goBack}>
            <img
              src={ArrowLeftIcon}
              alt="back-navigation"
              style={{ width: '16px' }}
            />
          </button>
        </Box>
        <UserName>
          {[
            `${userDetails?.lastName},`,
            userDetails?.firstName,
            userDetails?.middleName,
          ].join(' ')}
        </UserName>
      </BackButtonContainer>
      <EventDurationContainer>
        *Activity events from last 30 days
      </EventDurationContainer>
      <Grid
        container
        xs={12}
        item
        justifyContent="center"
        sx={{ paddingTop: '5px' }}
      >
        <Grid
          item
          size={12}
          xl={11}
          md={12}
          lg={11}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <ReusableDataGrid
            columns={defaultColumns}
            rows={rows}
            rowHeight={35}
            // filterMode="client"
            // loading={rows.length === 0}
          />
        </Grid>
      </Grid>
    </ViewLayout>
  );
};

export default UserActivity
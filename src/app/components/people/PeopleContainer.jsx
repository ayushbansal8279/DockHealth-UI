import { Grid } from '@material-ui/core';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Spacing from 'components/common/Spacing';
import { createFilter } from 'react-search-input';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'ramda';
import * as PeopleActions from 'actions/people-actions';
import { RobotoTypography } from 'styles/theme';
import Member from '../members/Member/Member';
import { ListContainer, ListEntryContainer } from './PeopleContainer.Styled';
import { StyledDataGrid } from './DataGridStyles';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

class PeopleContainer extends PureComponent {
  renderEmptyEntry = () => (
    <ListEntryContainer>
      <Grid container justify="center" alignItems="center">
        <RobotoTypography variant="h4">No providers found</RobotoTypography>
      </Grid>
    </ListEntryContainer>
  );

  render = () => {
    const { peopleList, searchTerm, history } = this.props;

    const columns = [
      {
        field: 'userName',
        headerName: 'USER',
        flex: 1,
        renderCell: ({ row }) => {
          return (
            <>
              <Member size={22} member={row} />
              <Spacing horizontal={4} />
              <span className="people-cell">{row?.userName}</span>
            </>
          );
        },
      },
      {
        field: 'email',
        headerName: 'EMAIL',
        flex: 1,
      },
      {
        field: 'orgUserRole',
        headerName: 'USER STATUS',
        flex: 0.5,
        valueFormatter: ({ value }) => capitalizeFirstLetter(value),
      },
    ];

    const KEYS_TO_FILTERS = [
      'userName',
      'email',
      'homePhoneNumber',
      'faxNumber',
      'workPhoneNumber',
    ];

    const peopleWithId = peopleList.map(people => ({
      id: people?.userIdentifier,
      ...people,
    }));

    const filteredPeople =
      peopleWithId?.filter(createFilter(searchTerm, KEYS_TO_FILTERS)) ?? [];

    return (
      <>
        {isEmpty(filteredPeople) ? (
          <ListContainer>{this.renderEmptyEntry()}</ListContainer>
        ) : (
          <StyledDataGrid
            columns={columns}
            rows={filteredPeople}
            rowHeight={35}
            headerHeight={45}
            hideFooter
            hideFooterPagination
            autoHeight
            disableSelectionOnClick
            disableColumnMenu
            onCellClick={({ row, field }) => {
              if (field === 'userName') {
                history.push(
                  `/core/assignedToPerson/${encodeURIComponent(
                    row.userIdentifier,
                  )}`,
                );
              }
            }}
          />
        )}
      </>
    );
  };
}

function mapStateToProps(state) {
  return {
    userProfile: state.userState.userProfile,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PeopleActions, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PeopleContainer),
);

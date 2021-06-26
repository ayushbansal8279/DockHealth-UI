import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { createFilter } from 'react-search-input';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'ramda';
import Spacing from 'components/common/Spacing.tsx';
import * as PeopleActions from 'actions/people-actions';
import { RobotoTypography } from 'styles/theme';
import Member from '../members/Member/Member';
import { ListContainer, ListEntryContainer } from './styled';
import { StyledDataGrid } from './DataGridStyles';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const renderColumnHeader = props => {
  const { colDef } = props;
  const { headerName } = colDef;

  return (
    <>
      <div className="MuiDataGrid-colCellTitle">
        <span>{headerName}</span>
      </div>
    </>
  );
};

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
        renderHeader: renderColumnHeader,
        renderCell: ({ row }) => {
          return (
            <div
              className="people-cell-container"
              onClick={() =>
                history.push(
                  `/core/assignedToPerson/${encodeURIComponent(
                    row.userIdentifier,
                  )}`,
                )
              }
            >
              <Member size={22} member={row} />
              <Spacing horizontal={4} />
              <span className="people-cell">{row?.userName}</span>
            </div>
          );
        },
      },
      {
        field: 'email',
        headerName: 'EMAIL',
        renderHeader: renderColumnHeader,
        flex: 1,
      },
      {
        field: 'orgUserRole',
        headerName: 'USER STATUS',
        renderHeader: renderColumnHeader,
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
            hideFooterSelectedRowCount
            autoHeight
            disableSelectionOnClick
            disableColumnMenu
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

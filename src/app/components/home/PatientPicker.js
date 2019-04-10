import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import SearchHeader from './SearchHeader';
import PickerHeader from './PickerHeader';
import ListItem from './ListItem';

const StyledPopover = styled(Popover).attrs({
  paper: 'paper',
  anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
  transformOrigin: { vertical: 'top', horizontal: 'center' },
})`
  && .paper {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 235px;
  }
`;

const List = styled.div`
  background: #fff;
  max-height: 255px;
  overflow: auto;
`;

const MemberName = styled.span`
  margin-left: 20px;
`;

const UNASSIGNED_ELEMENT_ID = -1;

const PatientPickerHeader = ({ close, toggleSearch }) => {
  return (
    <PickerHeader
      handleClose={close}
      handleSearchToggle={toggleSearch}
      closeLabel="Close user selection"
    >
      Assign patient
    </PickerHeader>
  );
};

const PatientPickerSearchHeader = ({ search, toggleSearch }) => (
  <SearchHeader handleSearch={search} handleSearchToggle={toggleSearch} />
);

const PatientPicker = ({
  patient, patients, assign, children: Component,
}) => {
  const select = useCallback(
    (e) => {
      const patientId = e.currentTarget.id;
      assign(patientId);
    },
  );

  const [searchTerm, setSearchTerm] = useState('');
  const search = useCallback(
    (e) => { setSearchTerm(e.target.value); },
  );

  const [isSearching, setIsSearching] = useState(false);
  const toggleSearch = useCallback(
    () => {
      setIsSearching(!isSearching);
      setSearchTerm('');
    },
    [isSearching],
  );

  const [anchor, setAnchor] = useState(null);
  const open = useCallback(
    (e) => {
      e.stopPropagation();
      setAnchor(e.currentTarget);
    },
  );
  const close = useCallback(
    () => {
      setAnchor(null);
      setIsSearching(false);
      setSearchTerm('');
    },
  );

  // Search
  const searchTerms = searchTerm.toLowerCase().match(/[\S]+/g) || [];
  const isMatch = text => searchTerms.every(term => text.toLowerCase().includes(term));

  const filteredPatients = patients
    && (searchTerms.length === 0
      ? patients
      : patients.filter(({ firstName, lastName }) => isMatch(firstName) || isMatch(lastName)));

  const sortedPatients = filteredPatients
    && filteredPatients.sort((a, b) => a.lastName.localeCompare(b.lastName));

  return (
    <React.Fragment>
      <Component open={open} />
      <StyledPopover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
      >
        {isSearching
          ? <PatientPickerSearchHeader search={search} toggleSearch={toggleSearch} />
          : <PatientPickerHeader close={close} toggleSearch={toggleSearch} />}
        <List>
          <ListItem
            selected={patient == null}
            onClick={select}
            id={UNASSIGNED_ELEMENT_ID}
          >
            <MemberName><em>Unassigned</em></MemberName>
          </ListItem>
          {sortedPatients && sortedPatients.map(m => (
            <ListItem
              member={m}
              key={m.patientId}
              selected={patient && m.patientId === patient.patientId}
              onClick={select}
              id={m.patientId}
            >
              <MemberName>{`${m.firstName} ${m.lastName}`}</MemberName>
            </ListItem>
          ))}
        </List>
      </StyledPopover>
    </React.Fragment>
  );
};

const patientShape = PropTypes.shape({
  patientId: PropTypes.number,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  mrn: PropTypes.string,
});

PatientPicker.propTypes = {
  patient: patientShape,
  patients: PropTypes.arrayOf(patientShape),
  assign: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

PatientPicker.defaultProps = {
  patient: null,
  patients: null,
};

export default PatientPicker;

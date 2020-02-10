import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import SearchHeader from '../common/SearchHeader';
import PickerHeader from '../common/PickerHeader';
import ListItem from '../common/ListItem';

const StyledPopover = styled(Popover).attrs({
  classes: { paper: 'paper' },
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

const PatientPickerHeader = ({ close, toggleSearch }) => (
  <PickerHeader
    handleClose={close}
    handleSearchToggle={toggleSearch}
    closeLabel="Close user selection"
  >
    Assign patient
  </PickerHeader>
);

const PatientPicker = ({ patient, patients, assign, children: Component }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const search = useCallback(e => {
    setSearchTerm(e.target.value);
  });

  const [isSearching, setIsSearching] = useState(false);
  const toggleSearch = useCallback(
    () => {
      setIsSearching(!isSearching);
      setSearchTerm('');
    },
    [isSearching],
  );

  const [anchor, setAnchor] = useState(null);
  const open = useCallback(e => {
    e.stopPropagation();
    setAnchor(e.currentTarget);
  });
  const close = useCallback(() => {
    setAnchor(null);
    setIsSearching(false);
    setSearchTerm('');
  });

  const select = useCallback(e => {
    const patientIdentifier = e.currentTarget.id;
    assign(patientIdentifier);
    close();
  });

  const deselect = useCallback(() => {
    assign(null);
    close();
  });

  // Patient search
  const matchListing = (term, { firstName, lastName, mrn }) => {
    const firstNameMatches =
      firstName && firstName.toLowerCase().includes(term);
    const lastNameMatches = lastName && lastName.toLowerCase().includes(term);
    const mrnMatches = mrn && mrn.toLowerCase().includes(term);

    return firstNameMatches || lastNameMatches || mrnMatches;
  };

  const orderListings = (p1, p2) =>
    p1.lastName ? p1.lastName.localeCompare(p2.lastName) : -1;

  // Search
  const searchTerms = searchTerm.toLowerCase().match(/[\S]+/g) || [];
  const isMatch = listing =>
    searchTerms.every(term => matchListing(term, listing));

  const filteredListings =
    patients &&
    (searchTerms.length === 0 ? patients : patients.filter(isMatch));

  const sortedListings =
    filteredListings && filteredListings.sort(orderListings);

  return (
    <React.Fragment>
      <Component open={open} />
      <StyledPopover open={Boolean(anchor)} anchorEl={anchor} onClose={close}>
        {isSearching ? (
          <SearchHeader
            handleSearch={search}
            handleSearchToggle={toggleSearch}
          />
        ) : (
          <PatientPickerHeader close={close} toggleSearch={toggleSearch} />
        )}
        <List>
          <ListItem selected={patient == null} onClick={deselect}>
            <MemberName>Unassigned</MemberName>
          </ListItem>
          {sortedListings &&
            sortedListings.map(m => (
              <ListItem
                member={m}
                key={m.patientIdentifier}
                selected={patient && m.patientIdentifier === patient.patientIdentifier}
                onClick={select}
                id={m.patientIdentifier}
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
  patientIdentifier: PropTypes.number,
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

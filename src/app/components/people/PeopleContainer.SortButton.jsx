import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import isEmpty from 'ramda/es/isEmpty';
import React, { useRef } from 'react';

import useBoolean from '../../hooks/useBoolean';
import ChevronDownWhite from '../../img/chevron-down-white.svg';

const SortButtonElement = withStyles({
  root: {
    backgroundColor: '#0CA1C7',
    borderRadius: '1rem',
    color: '#fff',
    height: '2rem',
    marginLeft: '2rem',
    transition: 'all 0.2s ease',
    width: '7rem',
    '&:hover': {
      backgroundColor: '#0CA1C7',
      filter: 'brightness(1.25)',
      transition: 'all 0.2s ease',
    },
  },
  label: {
    alignItems: 'center',
    display: 'inline-flex',
    justifyContent: 'space-between',
    lineHeight: 1.15,
    textTransform: 'none',
  },
})(Button);

const PeopleContainerSortButton = ({ filters, setSorting }) => {
  const [popoverOpen, setPopoverOpen, unsetPopoverOpen] = useBoolean(false);
  const buttonReference = useRef(null);

  return (
    <>
      <SortButtonElement
        variant="contained"
        buttonRef={buttonReference}
        onClick={setPopoverOpen}
      >
        <span>Sort</span>
        <img alt="Chevron icon" src={ChevronDownWhite} />
      </SortButtonElement>
      {!isEmpty(filters) && (
        <Menu open={popoverOpen} onClose={unsetPopoverOpen}>
          {filters.map(({ key, label }) => (
            <MenuItem
              key={key}
              onClick={() => {
                setSorting({ key });
                unsetPopoverOpen();
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

PeopleContainerSortButton.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  setSorting: PropTypes.func,
};

PeopleContainerSortButton.defaultProps = {
  filters: [],
  setSorting: () => {},
};

export default PeopleContainerSortButton;

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import { BasePicker, Calendar } from 'material-ui-pickers';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import CalendarIcon from '../../img/calendar.svg';
import TimeSelect from './TimeSelect';

const StyledPopover = styled(Popover).attrs({ classes: { paper: 'paper' } })`
  && .paper {
    border-radius: 0;
    overflow: hidden;
  }
`;

const Header = styled.div`
  align-items: center;
  background: ${({ isOverdue }) => (isOverdue ? '#d9036b' : '#2a4a70')};
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
  height: 3rem;
  justify-content: space-between;
  min-width: 18.75rem;
  padding: 0 0.375rem;
  width: 18.75rem;
`;

const HeaderClose = styled.div`
  align-items: center;
  color: #fff;
  display: flex;
  font-size: 1.5rem;
  font-weight: bold;
  height: 1.5rem;
  padding: 0.25rem;
  width: 1.5rem;
`;

const HeaderTitle = styled.strong`
  margin-left: 15px;
  color: #fff;
  font-size: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const HeaderLeftContainer = styled.div`
  align-items: center;
  display: flex;
`;

const DatePickerHeader = ({ children, handleClose, isOverdue }) => (
  <Header isOverdue={isOverdue}>
    <HeaderLeftContainer>
      <img src={CalendarIcon} style={{ marginLeft: 5 }} alt="" />
      <HeaderTitle>
        <strong>{children}</strong>
      </HeaderTitle>
    </HeaderLeftContainer>
    <IconButton onClick={handleClose} aria-label="Close user selection">
      <HeaderClose>✕</HeaderClose>
    </IconButton>
  </Header>
);

DatePickerHeader.propTypes = {
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOverdue: PropTypes.bool,
};

DatePickerHeader.defaultProps = {
  isOverdue: false,
};

const DatePickerBody = styled.div`
  padding: 0.125rem;
`;

const FooterContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  padding-bottom: 0.5rem;
`;

const StyledButton = styled(Button)`
  && {
    margin-left: 4px;
    text-transform: none;
  }
`;

const ButtonContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;

  ${props =>
    props.centered &&
    `
    justify-content: center;
    width: 100%;

    ${StyledButton} {
      width: 6rem;
    }
  `}
`;

const DayButton = styled.div`
  align-items: center;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;
  display: flex;
  font-size: 0.75rem;
  height: 2.25rem;
  justify-content: center;
  margin: 0 0.125rem;
  position: relative;
  width: 2.25rem;

  ${props => props.pastDay && 'color: rgba(48, 53, 56, 0.5);'}
  ${props => props.notShown && 'color: rgba(48, 53, 56, 0.1);'}
  ${props =>
    props.current &&
    'background-color: rgba(42, 74, 112, 0.3); color: #2e3a43; font-weight: bold;'}
  ${props =>
    props.selected &&
    'background-color: #007CAB; border-radius: 50%; color: #fff; font-weight: bold;'}
`;

const DayButtonLabel = styled.div`
  bottom: 3px;
  font-size: 7px;
  font-weight: 300;
  position: absolute;
  text-align: center;
  width: 100%;
`;

const DateTimeSelect = ({
  children: Component,
  onChange,
  value,
  label,
  showTimeSelect = true,
  anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin = {
    vertical: 'top',
    horizontal: 'center',
  },
}) => {
  const [anchor, setAnchor] = useState(null);
  const [hasDateSelected, setHasDateSelected] = useState(false);

  const open = useCallback(
    event => {
      setAnchor(event.currentTarget);
      setHasDateSelected(Boolean(value));
    },
    [value],
  );

  const close = useCallback(() => setAnchor(null), []);

  const dateYesterday = moment();
  dateYesterday.subtract(1, 'days');

  const todayMoment = moment();

  return (
    <>
      <Component open={open} />
      <StyledPopover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        disablePortal
      >
        <BasePicker
          value={moment(value)}
          onChange={date => {
            onChange(date);
            close();
          }}
        >
          {({ date, handleChange, handleAccept }) => (
            <>
              <DatePickerHeader
                handleClose={close}
                isOverdue={date < dateYesterday}
              >
                {date < dateYesterday ? 'Past date selected!' : label}
              </DatePickerHeader>
              <DatePickerBody>
                <Calendar
                  date={date}
                  onChange={handleChange}
                  renderDay={(
                    shownMoment,
                    selectedMoment,
                    active,
                    calendarComponent,
                  ) => {
                    const {
                      children: day,
                      current,
                      hidden,
                      selected,
                    } = calendarComponent.props;

                    return (
                      <DayButton
                        current={!hasDateSelected && current}
                        selected={hasDateSelected && selected}
                        notShown={hidden}
                        pastDay={shownMoment.isBefore(todayMoment)}
                        onMouseUp={() => {
                          setHasDateSelected(true);
                        }}
                      >
                        <span>{day}</span>
                        {current && !hasDateSelected && (
                          <DayButtonLabel>Today</DayButtonLabel>
                        )}
                      </DayButton>
                    );
                  }}
                />
                <FooterContainer>
                  {showTimeSelect && (
                    <TimeSelect value={date} onChange={handleChange} />
                  )}
                  <ButtonContainer centered={!showTimeSelect}>
                    <StyledButton size="small" variant="text" onClick={close}>
                      Cancel
                    </StyledButton>
                    <StyledButton
                      size="small"
                      variant="text"
                      onClick={handleAccept}
                      disabled={!hasDateSelected}
                    >
                      Set
                    </StyledButton>
                  </ButtonContainer>
                </FooterContainer>
              </DatePickerBody>
            </>
          )}
        </BasePicker>
      </StyledPopover>
    </>
  );
};

DateTimeSelect.propTypes = {
  children: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

DateTimeSelect.defaultProps = {
  children: null,
};

export default DateTimeSelect;

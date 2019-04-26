import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { BasePicker, Calendar } from 'material-ui-pickers';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import CalendarIcon from '../img/calendar.svg';
import TimeSelect from './TimeSelect';

const StyledPopover = styled(Popover).attrs({ classes: { paper: 'paper' } })`
  && .paper {
    overflow: hidden;
  }
`;

const Header = styled.div`
  flex: 0 0;
  padding: 0 10px;
  display: flex;
  align-items: center;
  background: ${({ isOverdue }) => (isOverdue ? '#d9036b' : '#2a4a70')};
  height: 73px;
  width: 329px;
`;

const HeaderClose = styled.div`
  width: 22px;
  height: 22px;
  padding: 4px;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
`;

const HeaderTitle = styled.strong`
  margin-left: 15px;
  color: #fff;
  font-size: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DatePickerHeader = ({ children, handleClose, isOverdue }) => (
  <Header isOverdue={isOverdue}>
    <IconButton onClick={handleClose} aria-label="Close user selection">
      <HeaderClose>✕</HeaderClose>
    </IconButton>
    <img src={CalendarIcon} style={{ marginLeft: 5 }} alt="" />
    <HeaderTitle>
      <strong>{children}</strong>
    </HeaderTitle>
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
  padding: 0 8px 10px 8px;
`;

const FooterContainer = styled.div`
  padding: 5px 10px 0 10px;
  flex-direction: row;
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  margin-left: auto;
`;

const StyledButton = styled(Button)`
  && {
    color: #007cab;
    margin-left: 4px;
  }
`;

const DateTimeSelect = ({ children: Component, onChange, value }) => {
  const [anchor, setAnchor] = useState(null);

  const open = useCallback(
    e => setAnchor(e.currentTarget),
  );

  const close = useCallback(
    () => setAnchor(null),
  );

  const dateNow = moment();

  return (
    <>
      <Component open={open} />
      <StyledPopover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <BasePicker
          value={value ? moment(value) : moment().startOf('day')}
          onChange={(date) => { onChange(date); close(); }}
        >
          {({ date, handleChange, handleAccept }) => (
            <>
              <DatePickerHeader
                handleClose={close}
                isOverdue={date < dateNow}
              >
                {date < dateNow ? 'This reminder is overdue!' : 'Set a reminder'}
              </DatePickerHeader>
              <DatePickerBody>
                <Calendar date={date} onChange={handleChange} />
                <FooterContainer>
                  <TimeSelect
                    value={date}
                    onChange={handleChange}
                  />
                  <ButtonContainer>
                    <StyledButton onClick={close}>CANCEL</StyledButton>
                    <StyledButton onClick={handleAccept}>SET</StyledButton>
                  </ButtonContainer>
                </FooterContainer>
              </DatePickerBody>
            </>
          )
        }
        </BasePicker>
      </StyledPopover>
    </>
  );
};

DateTimeSelect.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

DateTimeSelect.defaultProps = {
  children: null,
};

export default DateTimeSelect;

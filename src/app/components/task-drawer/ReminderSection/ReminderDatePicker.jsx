import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Datepicker from 'components/common/Datepicker/Datepicker';
import TimeDropdownInput from 'components/common/TimeDropdownInput/TimeDropdownInput';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import { TIME_12H_FORMAT } from 'helpers/task-drawer-helpers';
import {
    ContentWrapper,
    Divider,
    QuickAddSectionWrapper,
    Label,
    AddSectionWrapper,
    DateViewText,
    DateViewContainer
} from './styled';

export const DATE_MASK_FORMAT = 'MM/DD/YYYY';

const ReminderDatePicker = ({
    selectedDate,
    onDateChange,
    onCloseClick,
    onTimeChange,
    selectedTime
    // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {

    const [dateMaskValue, setDateMaskValue] = useState(
        selectedDate ? moment(selectedDate).format(DATE_MASK_FORMAT) : null,
    );
    const [timeMaskValue, setTimeMaskValue] = useState(
        selectedTime ? selectedTime : null,
    );
    const [dateValue, setDateValue] = useState(selectedDate);

    useEffect(() => {
        if (selectedDate !== dateValue) {
            setDateMaskValue(moment(selectedDate).format(DATE_MASK_FORMAT));
            setDateValue(selectedDate);
        }
    }, [dateValue, selectedDate]);

    return (
        <ContentWrapper>
            <QuickAddSectionWrapper>
                <AddSectionWrapper>
                    <Label>Date</Label>
                    <DateViewContainer>
                        <DateViewText>
                            {dateMaskValue}
                        </DateViewText>
                    </DateViewContainer>
                </AddSectionWrapper>
                <AddSectionWrapper>
                    <Label>Time</Label>
                    <TimeDropdownInput
                        type="secondary"
                        savedValue={timeMaskValue}
                        onSave={onTimeChange}
                        disabled={!selectedDate}
                        hideError
                    />
                </AddSectionWrapper>
            </QuickAddSectionWrapper>
            <Divider />
            <Datepicker selectedDate={selectedDate} onDateChange={onDateChange} />
            <PopoverBottomBar align="spread">
                <PopoverBottomBar.Button type="button" onClick={onCloseClick}>
                    Close
                </PopoverBottomBar.Button>
            </PopoverBottomBar>
        </ContentWrapper>
    )
};

export default React.memo(ReminderDatePicker);
import React from 'react';
import moment from 'moment';
import {
  Container,
  DescriptionContainer,
  Description,
  DateText,
  TypeText,
} from './styled';

const HistoryItem = props => {
  const { description, date, type } = props;

  const momentDate = moment(date);
  const formattedDate = momentDate.isValid()
    ? momentDate.format('MMM D, YYYY @ h:mma')
    : '';

  return (
    <Container>
      <DescriptionContainer>
        <Description>{description}</Description>
        <DateText>{formattedDate}</DateText>
      </DescriptionContainer>
      <TypeText>{type}</TypeText>
    </Container>
  );
};

export default HistoryItem;

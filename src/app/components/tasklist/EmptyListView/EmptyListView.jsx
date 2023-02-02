import React from 'react';
import {
  EmptyListContainer,
  ContentWrapper,
  TextWrapper,
  Title,
  Description,
} from './styled';

const EmptyListView = ({ title, description, widthBreakpoint }) => (
  <EmptyListContainer>
    <ContentWrapper mediaBreakpoint={widthBreakpoint}>
      <TextWrapper style={{ paddingRight: '0px' }}>
        {Array.isArray(title) ? (
          title.map((t) => (
            <Title>
              {t}
              <br />
            </Title>
          ))
        ) : (
          <Title>{title}</Title>
        )}
        <Description>{description}</Description>
      </TextWrapper>
    </ContentWrapper>
  </EmptyListContainer>
);

export default EmptyListView;

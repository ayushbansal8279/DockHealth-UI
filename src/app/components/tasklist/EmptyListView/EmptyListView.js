import React from 'react';
import {
  EmptyListContainer,
  ContentWrapper,
  TextWrapper,
  ImageWrapper,
  Image,
  Title,
  Description,
} from './styled';

const EmptyListView = ({
  title,
  description,
  image,
  imageStyle,
  widthBreakpoint,
}) => (
  <EmptyListContainer>
    <ContentWrapper mediaBreakpoint={widthBreakpoint}>
      <TextWrapper style={{ paddingRight: '0px' }}>
        {Array.isArray(title) ? (
          title.map(t => (
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
      <ImageWrapper>
        <Image src={image} alt="empty view" style={imageStyle} />
      </ImageWrapper>
    </ContentWrapper>
  </EmptyListContainer>
);

export default EmptyListView;

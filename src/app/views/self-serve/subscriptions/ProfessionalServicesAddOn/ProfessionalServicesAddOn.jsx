import { Box } from '@mui/material';
import React from 'react';
import palette from 'styles/palette';
import ServiceAddOnFeature from '../ServiceAddOnFeature/ServiceAddOnFeature';
import {
  Container,
  Name,
  Description,
  PriceContainer,
  Price,
  FeatureText,
  ContactUsAnchor,
  LeftContainer,
  RightContainer,
} from './styled';

const ProfessionalServicesAddOn = (props) => {
  const { service } = props;
  const { label, description, features, price } = service;

  const featuresDescription = service.featuresDescription ?? null;

  return (
    <Container color={palette.newDarkBlue}>
      <LeftContainer>
        <Name color={palette.newDarkBlue}>{label}</Name>
        <Description>{description}</Description>
        <PriceContainer>
          <>
            <Price color="#000000">{price}</Price>
          </>
        </PriceContainer>
        <ContactUsAnchor
          color={palette.newDarkBlue}
          onClick={() => {
            window.Intercom('show');
          }}
        >
          Contact Us
        </ContactUsAnchor>
      </LeftContainer>
      <RightContainer>
        <FeatureText>{featuresDescription}</FeatureText>
        <Box m={2} />
        {features.map((feature) => (
          <ServiceAddOnFeature feature={feature} />
        ))}
      </RightContainer>
    </Container>
  );
};

export default ProfessionalServicesAddOn;

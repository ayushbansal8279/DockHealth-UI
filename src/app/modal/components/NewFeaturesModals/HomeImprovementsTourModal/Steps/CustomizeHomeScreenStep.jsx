import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import CustomizeHomeImage from 'img/tour/home-improvements/customize-home.svg';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const CustomizeHomeScreenStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Home Improvements modal', 'Customize Home Screen');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image
        height={295}
        src={CustomizeHomeImage}
        alt="Customize Home Screen"
      />
      <Spacing vertical={5} />
      <Title>Customize your Home Screen</Title>
      <Description>
        Select which columns you would like to see or hide by clicking the gear
        in the upper right hand corner and selecting what works best for you.
      </Description>
    </>
  );
};

export default CustomizeHomeScreenStep;

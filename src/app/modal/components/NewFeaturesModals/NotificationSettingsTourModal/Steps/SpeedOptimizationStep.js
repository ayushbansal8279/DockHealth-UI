import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import SpeedOptimizationImage from 'img/tour/notification-settings/speed-optimization';
import { onNotificationSettingsTourModalEvent } from 'helpers/ga-event-helper';
import { Image, Title, Description } from './styled';

const SpeedOptimizationStep = () => {
  useEffect(() => {
    onNotificationSettingsTourModalEvent('Speed optimization');
  }, []);

  return (
    <>
      <Image
        height={308}
        src={SpeedOptimizationImage}
        alt="Speed optimization"
      />
      <Spacing vertical={5} />
      <Title>Optimized for speed</Title>
      <Description>
        We made enhancements to Dock to accelerate speed and performance, which
        means you should see much faster response times.
      </Description>
    </>
  );
};

export default SpeedOptimizationStep;

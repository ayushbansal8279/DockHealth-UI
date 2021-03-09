import React, { useEffect } from 'react';
import Spacing from 'components/common/Spacing';
import BulkSelectionImage from 'img/tour/right-click/bulk-selection';
import { onTourModalStepEnter } from 'helpers/ga-event-helper';
import { Image, Title, Description } from '../../styled';

const BulkSelectionStep = () => {
  useEffect(() => {
    onTourModalStepEnter('Right click modal', 'Bulk Selection');
  }, []);

  return (
    <>
      <Spacing vertical={4} />
      <Image
        height={295}
        src={BulkSelectionImage}
        alt="Bulk selection &amp; actions"
      />
      <Spacing vertical={5} />
      <Title>Bulk selection &amp; actions</Title>
      <Description>
        Now you can select multiple tasks so that you can duplicate, move,
        complete, change status or date, reassign or delete all in a few clicks.
      </Description>
    </>
  );
};

export default BulkSelectionStep;

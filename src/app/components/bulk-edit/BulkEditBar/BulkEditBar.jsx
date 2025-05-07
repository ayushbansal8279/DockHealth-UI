import React from 'react';
import { Container, TasksText, CloseButton, CloseIcon } from './styled';
import { useSelector } from 'react-redux';
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper';
import { userProfileSelector } from '@/app/selectors/user-selectors';

const BulkEditBar = (props) => {
  const {
    numberOfSelectedItems,
    onClose,
    children,
    viewType = 'task',
    isDisabled,
    includedWorkflow,
  } = props;

  const currentUser = useSelector(userProfileSelector); 
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  const getLabel = () => {
    if (viewType === 'user') return 'User';
    if (viewType === 'patient') return customerTypeLabel.charAt(0).toUpperCase() + customerTypeLabel.slice(1);
    if (viewType === 'task') return `Task${includedWorkflow ? '/Workflow' : ''}`;
    return '';
  };

  const pluralize = (word, count) => `${word}${count !== 1 ? 's' : ''}`;

  const label = getLabel();

  return (
    <Container>
      <TasksText>
        {`${numberOfSelectedItems} ${pluralize(label, numberOfSelectedItems)} Selected`}
      </TasksText>
      {children}
      <CloseButton type="button" onClick={onClose} isDisabled={isDisabled}>
        <CloseIcon />
      </CloseButton>
    </Container>
  );
};

export default BulkEditBar;

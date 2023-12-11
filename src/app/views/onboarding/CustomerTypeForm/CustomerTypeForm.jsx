import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { userProfileSelector } from 'selectors/user-selectors';
import { useSelector } from 'react-redux';
import OnboardingIndicator from 'components/common/OnboardingIndicator/OnboardingIndicator';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import Checkbox from 'components/common/Checkbox/Checkbox';
import palette from 'styles/palette';
import {
  Title,
  UnderTitle,
  FormWrapper,
  ButtonWrapper,
  ButtonsContainer,
  PickerItem,
} from './styled';

const CustomerTypeForm = ({ onSubmit, customerTypesList }) => {
  const { orgUserRole } = useSelector(userProfileSelector);
  const firstTimeUser = localStorage.getItem('STORAGE_NEW_USER_FIRST_TIME');
  const [selectedRecord, setselectedRecord] = useState(customerTypesList[0]);
  const formContext = useForm({
    revalidationMode: 'onChange',
  });
  const { handleSubmit } = formContext;

  const renderItem = (item) => (
    <PickerItem
      key={item.key}
      onClick={() => {
        setselectedRecord(item);
      }}
    >
      <Checkbox
        isChecked={item.key === selectedRecord.key}
        isCircle
        size={20}
      />
      <Spacing horizontal={3} />
      <span>{item.name}</span>
    </PickerItem>
  );

  return (
    <>
      {firstTimeUser && (
        <>
          <OnboardingIndicator
            steps={orgUserRole === 'OWNER' ? 5 : 3}
            completedSteps={orgUserRole === 'OWNER' ? 4 : 3}
          />
          <Spacing vertical={5} />
        </>
      )}
      <FormWrapper onSubmit={handleSubmit(() => onSubmit({ selectedRecord }))}>
        <UnderTitle>Almost Done!</UnderTitle>
        <Title>What do you call your customers?</Title>
        <Spacing vertical={5} />
        {customerTypesList.map((element) => renderItem(element))}
        <Spacing vertical={5} />
        <ButtonsContainer>
          <ButtonWrapper>
            <Button
              fullWidth
              type="submit"
              color={palette.brightOrange}
              secondaryColor={palette.oPlusRed}
            >
              Continue
            </Button>
          </ButtonWrapper>
        </ButtonsContainer>
      </FormWrapper>
    </>
  );
};

export default CustomerTypeForm;

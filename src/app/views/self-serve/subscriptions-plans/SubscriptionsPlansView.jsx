import { times } from 'ramda';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMount, useToggle } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import PlanCardsContainer from './SubscriptionsPlansView.PlanCardsContainer';
import { subscriptionFeatures } from './SubscriptionsPlansView.PlanData';
import {
  SubscriptionsPlansViewContainer,
  Title,
} from './SubscriptionsPlansView.Styled';

const SubscriptionsPlansView = () => {
  const [annualPayment, toggleAnnualPayment] = useToggle(true);
  const [featureListExpanded, toggleFeatureListExpanded] = useToggle(false);
  const [chosenPlan, setChosenPlan] = useState('');
  const featureRowReferences = times(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    () => useRef(null),
    subscriptionFeatures.length,
  );
  const dispatch = useDispatch();

  useMount(() => {
    setHeader(dispatch)({
      backgroundColor: '#007cab',
      layout: [
        {
          key: 'title',
          component: (
            <div>
              <Title>Subscription & Users</Title>
            </div>
          ),
          alignItems: 'center',
        },
      ],
    });
  });

  return (
    <SubscriptionsPlansViewContainer>
      <PlanCardsContainer
        toggleAnnualPayment={toggleAnnualPayment}
        toggleFeatureListExpanded={toggleFeatureListExpanded}
        featureListExpanded={featureListExpanded}
        featureRowReferences={featureRowReferences}
        annualPayment={annualPayment}
        setChosenPlan={setChosenPlan}
        chosenPlan={chosenPlan}
      />
    </SubscriptionsPlansViewContainer>
  );
};

export default SubscriptionsPlansView;

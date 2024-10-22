import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ViewLayout from '@/app/components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from '@/app/components/template/BasicLayoutHeader/BasicLayoutHeader';
import { checkIfUserIsOrganizationAdmin } from '@/app/helpers/user-helper';
import {
  MeterBillingViewOuterContainer,
  MeterBillingViewContainer,
  MeterBillingSecondHeader,
} from './styled';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import MeteringTable from './MeteringTable/MeteringTable';
import MeteringFilter from './MeteringFilter/MeteringFilter';
import MeteringSearch from './MeteringSearch/MeteringSearch';

const MeterBillingView = () => {
  const history = useHistory();

  const currentUser = useSelector(userProfileSelector);

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(currentUser)) {
      history.push('/');
    }
  }, [currentUser]);

  return (
    <ViewLayout header={<BasicLayoutHeader title="Metered Billing" />}>
      <MeterBillingViewOuterContainer>
        <MeterBillingViewContainer>
          <MeterBillingSecondHeader>
            <MeteringFilter />
            <MeteringSearch />
          </MeterBillingSecondHeader>
          <MeteringTable />
        </MeterBillingViewContainer>
      </MeterBillingViewOuterContainer>
    </ViewLayout>
  );
};

export default MeterBillingView;

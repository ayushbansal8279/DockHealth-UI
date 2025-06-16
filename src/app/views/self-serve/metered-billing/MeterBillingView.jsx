import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ViewLayout from '@/app/components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from '@/app/components/template/BasicLayoutHeader/BasicLayoutHeader';
import { checkIfUserIsOrganizationAdmin } from '@/app/helpers/user-helper';
import {
  MeterBillingViewOuterContainer,
  MeterBillingViewContainer,
  MeterBillingSecondHeader,
  StatsHeader,
} from './styled';
import { userProfileSelector } from '@/app/selectors/user-selectors';
import MeteringTable from './MeteringTable/MeteringTable';
import MeteringFilter from './MeteringFilter/MeteringFilter';
import MeteringSearch from './MeteringSearch/MeteringSearch';
import MeteringStatsPanels from './MeteringStatsPanels/MeteringStatsPanels';
import { getMeteringEvents, getMeteringAggregationEvents } from '@/app/api/metering-api';
import { organizationSelector } from '@/app/selectors/organization-selectors';
import moment from 'moment';
import { convertFilterToPayload } from './MeteringFilter/helper';

const INITIAL_STATS = [
  { code: 'AUTOMATION', name: 'Automation Events', total: 0 },
  { code: 'EHR', name: 'EHR Events', total: 0 },
  { code: 'API', name: 'Dock API Events', total: 0 },
];

const DEFAULT_LIMIT = 500;
// const DEFAULT_START_DATE = moment().startOf('day');
// const DEFAULT_END_DATE = moment().startOf('day').add(1, 'day');
const DEFAULT_START_DATE = moment().startOf('month');
const DEFAULT_END_DATE = moment().startOf('month').add(1, 'month');

const MeterBillingView = () => {
  const history = useHistory();
  const [billingData, setBillingData] = useState({});
  const [statsData, setStatsData] = useState(INITIAL_STATS);
  const [startDate, setStartDate] = useState(DEFAULT_START_DATE);
  const [endDate, setEndDate] = useState(DEFAULT_END_DATE);
  const [filterOptions, setFilterOptions] = useState({eventDateOptions: {
    dateStart: DEFAULT_START_DATE.format('YYYY-MM-DD'),
    dateEnd: DEFAULT_END_DATE.format('YYYY-MM-DD'),
    options: ["DATE_RANGE"]
  }});
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [eventsCount, setEventsCount] = useState(DEFAULT_LIMIT);

  const currentUser = useSelector(userProfileSelector);
  const { organizationIdentifier } = useSelector(organizationSelector);

  const handleStatClick = async (statType) => {
    setFilterOptions({
      ...filterOptions,
      eventTypes: {
        options: [statType]
      }
    });
    setBillingData([]);
    setOffset(0);
    setLimit(DEFAULT_LIMIT);
  };

  const getAggregatedStats = async () => {
    try {
      setIsLoading(true);

      var duration = moment.duration(endDate.diff(startDate));
      var days = duration.days();
      var months = duration.months();

      const aggregationsPayload = {
        aggregationEvent: {
          organizationIdentifier: organizationIdentifier,
          start: startDate.format("YYYY-MM-DD")+'T00:00:00.000Z',
          end: endDate.format("YYYY-MM-DD")+'T00:00:00.000Z',
          eventIdentifier: null,
          duration: days > 1 || months >= 1 ? 'DAILY' : 'HOURLY',
          ts: null
        },
      };
      
      const aggregationsResult = await getMeteringAggregationEvents(aggregationsPayload);
      
      if (aggregationsResult && aggregationsResult.length > 0) {
        const automationEvents = aggregationsResult.filter(event => event.type === "AUTOMATION").reduce((sum, event) => sum + (event.cost || 0), 0);
        const ehrEvents = aggregationsResult.filter(event => event.type === "EHR").reduce((sum, event) => sum + (event.cost || 0), 0);
        const dockApiEvents = aggregationsResult.filter(event => event.type === "API").reduce((sum, event) => sum + (event.cost || 0), 0);

        const newStatsData = [
          { code: 'AUTOMATION', name: 'Automation Events', total: automationEvents },
          { code: 'EHR', name: 'EHR Events', total: ehrEvents },
          { code: 'API', name: 'Dock API Events', total: dockApiEvents },
        ];
        
        setStatsData(newStatsData);

        const totalEventsCount = filterOptions?.eventTypes?.options?.reduce((sum, option) => sum + (aggregationsResult.filter(event => event.type === option).reduce((sum, event) => sum + (event.cost || 0), 0)), 0);
        setEventsCount(totalEventsCount);
        
      } else {
        setStatsData(INITIAL_STATS);
        setEventsCount(0);
      }
    } catch (error) {
      console.error('Error fetching metering data:', error);
      setStatsData(INITIAL_STATS);
    } finally {
      setIsLoading(false);
    }
  };

  const getMeteringRawEvents = async () => {
    if(filterOptions?.eventDateOptions?.dateStart && filterOptions?.eventDateOptions?.dateEnd) {      
      const payload = convertFilterToPayload(
        filterOptions,
        organizationIdentifier,
        offset,
        limit,
      );
      const result = await getMeteringEvents(payload);
      if (result) setBillingData(result);
    }
  };

  const handleFilterChange = (filters) => {
    setFilterOptions(filters);
  };

  const handlePaginationChange = (page, pageSize) => {
    setOffset(page > 0 ? page * pageSize : 0);
    setLimit(pageSize);
  };

  // Handle user authentication
  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(currentUser)) {
      history.push('/');
    }
  }, [currentUser, history]);

  // Handle date updates from filter
  useEffect(() => {
    if (!filterOptions?.eventDateOptions?.dateStart || !filterOptions?.eventDateOptions?.dateEnd) {
      setStartDate(DEFAULT_START_DATE);
      setEndDate(DEFAULT_END_DATE);
    } else {
      setStartDate(moment(filterOptions.eventDateOptions.dateStart).startOf('day'));
      setEndDate(moment(filterOptions.eventDateOptions.dateEnd).startOf('day'));
    }
  }, [filterOptions]);

  // Fetch metering data when dates change
  useEffect(() => {
    if (startDate && endDate){
      getAggregatedStats();
      if (filterOptions?.eventTypes?.options?.length > 0) {
        getMeteringRawEvents();
      }
    }
  }, [startDate, endDate, organizationIdentifier]);

  useEffect(() => {
    if (startDate && endDate && filterOptions?.eventTypes?.options?.length > 0) {
      getMeteringRawEvents();
    }
  }, [offset, limit, organizationIdentifier]);

  return (
    <ViewLayout header={<BasicLayoutHeader title="Metered Billing" />}>
      <MeterBillingViewOuterContainer>
        <MeterBillingViewContainer>
          <MeterBillingSecondHeader>
            <MeteringFilter
              onFilterChange={handleFilterChange}
            />
          </MeterBillingSecondHeader>

          <StatsHeader>
            <span>Statistics from <strong>{startDate.format('MMMM DD, YYYY hh:mm a')}</strong> to <strong>{endDate.format('MMMM DD, YYYY hh:mm a')}</strong></span>
          </StatsHeader>
          
          <MeteringStatsPanels stats={statsData} onStatClick={handleStatClick} />
          
          {billingData && billingData.length > 0 
          && <MeteringTable billingData={billingData} onPaginationChange={handlePaginationChange} rowCount={eventsCount} defaultPageSize={DEFAULT_LIMIT} />}
        </MeterBillingViewContainer>
      </MeterBillingViewOuterContainer>
    </ViewLayout>
  );
};

export default MeterBillingView;

import React from 'react';
import {
  MeteringStatsPanelsContainer,
  StatsPanel,
  ClickableValue,
} from './styled';

const MeteringStatsPanels = ({ stats, onStatClick }) => {
  const defaultStats = [
    { code: 'AUTOMATION', name: 'Automation Events', total: 0 },
    { code: 'EHR', name: 'EHR Events', total: 0 },
    { code: 'API', name: 'Dock API Events', total: 0 },
    // { code: 'EXTERNAL', name: 'External API Events', total: 0 },
  ];

  const displayStats = stats || defaultStats;

  const handleStatClick = (stat) => {
    if (onStatClick) {
      onStatClick(stat.code);
    }
  };

  return (
    <MeteringStatsPanelsContainer>
      {displayStats.map((stat) => (
        <StatsPanel key={stat.name}>
          <ClickableValue onClick={() => handleStatClick(stat)}>
            {stat.total}
          </ClickableValue>
          <div className="stats-label">{stat.name}</div>
        </StatsPanel>
      ))}
    </MeteringStatsPanelsContainer>
  );
};

export default MeteringStatsPanels;

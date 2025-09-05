import { Link, useLocation } from 'react-router-dom';
import Tooltip from '../common/Tooltip/Tooltip';

const RelationshipLinks = ({ refs = [], relatedProfileType }) => {
  const location = useLocation();

  if (!refs || refs.length === 0) return null;

  const tooltipContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {refs.map((ref) => (
        <Link
          key={ref.identifier}
          to={{
            pathname: `/core/custom-objects/${relatedProfileType}/${ref.identifier}`,
            state: { from: location.pathname },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {ref.displayValue}
        </Link>
      ))}
    </div>
  );

  return (
    <Tooltip title={tooltipContent} placement="top" arrow>
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {refs.map((ref, index) => (
          <Link
            key={ref.identifier}
            to={{
              pathname: `/core/custom-objects/${relatedProfileType}/${ref.identifier}`,
              state: { from: location.pathname },
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              marginRight: index < refs.length - 1 ? 4 : 0,
              whiteSpace: 'nowrap',
            }}
          >
            {ref.displayValue}
            {index < refs.length - 1 ? ',' : ''}
          </Link>
        ))}
      </div>
    </Tooltip>
  );
};

export default RelationshipLinks;
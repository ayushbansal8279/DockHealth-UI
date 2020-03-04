import React from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { setHeader } from '../actions/header-actions';
import GenericHeader from '../components/common/GenericHeader';

const SupportSectionView = () => {
  const dispatch = useDispatch();

  useMount(() => {
    setHeader(dispatch)({
      layout: [
        {
          key: 'generic-header',
          component: <GenericHeader isFetching={false}>Support</GenericHeader>,
        },
      ],
    });
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className="list-wrapper">
        <div className="row">
          <div className="column">
            <h5>
              <span>For Dock Health support, email us at &nbsp;</span>
              <a
                href="mailto:support@dock.health?Subject=Dock%20Support"
                target="_top"
                style={{ color: '#007cab' }}
              >
                support@dock.health
              </a>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSectionView;

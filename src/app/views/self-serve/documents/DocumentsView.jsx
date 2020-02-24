import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import useBoolean from '../../../hooks/useBoolean';
import BaaPreview from './DocumentsView.BaaPreview';
import {
  DocumentLink,
  DocumentsViewContainer,
  Title,
} from './DocumentsView.Styled';

const DocumentsView = () => {
  const dispatch = useDispatch();

  const { userProfile } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
    };
  });

  const [isPreviewOpen, openPreview, hidePreview] = useBoolean(false);
  const [isPreviewReady, setPreviewReady] = useBoolean(false);

  const isUserAdmin = ['ADMIN', 'OWNER'].includes(userProfile.orgUserRole);

  useMount(() => {
    setHeader(dispatch)({
      backgroundColor: '#007cab',
      layout: [
        {
          key: 'title',
          component: (
            <div>
              <Title>Documents & Agreements</Title>
            </div>
          ),
          alignItems: 'center',
        },
      ],
    });
  });

  const onBaaLabelClick = useCallback(() => {
    setPreviewReady();
    openPreview();
  }, [openPreview, setPreviewReady]);

  return (
    <DocumentsViewContainer container direction="column">
      {isUserAdmin && (
        <DocumentLink onClick={onBaaLabelClick}>BAA</DocumentLink>
      )}
      <DocumentLink
        href="https://www.dock.health/end-user-license-agreement"
        target="_blank"
      >
        EULA
      </DocumentLink>
      <DocumentLink
        href="https://www.dock.health/privacypolicy"
        target="_blank"
      >
        Privacy Statement
      </DocumentLink>
      <DocumentLink
        href="https://www.dock.health/terms-conditions"
        target="_blank"
      >
        Terms of Service
      </DocumentLink>
      {isPreviewReady && (
        <BaaPreview isPreviewOpen={isPreviewOpen} hidePreview={hidePreview} />
      )}
    </DocumentsViewContainer>
  );
};

export default DocumentsView;

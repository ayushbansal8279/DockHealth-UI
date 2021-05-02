import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from 'react-use';
import { setHeader } from 'actions/template-actions';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import Spacing from 'components/common/Spacing';
// import useBoolean from 'hooks/useBoolean';
import PdfPage from 'img/pdf-page.png';
import { MontserratTypography } from 'styles/theme-montserrat';
import { downloadBAADocument } from 'api/organization-api';
// import BaaPreview from './DocumentsView.BaaPreview';
import {
  DocumentImage,
  DocumentLink,
  DocumentsViewContainer,
} from './DocumentsView.Styled';

const DocumentsView = () => {
  const dispatch = useDispatch();

  const { userProfile } = useSelector(store => {
    return {
      userProfile: store.userState.userProfile,
    };
  });

  // const [isPreviewOpen, openPreview, hidePreview] = useBoolean(false);
  // const [isPreviewReady, setPreviewReady] = useBoolean(false);

  const isUserAdmin = ['ADMIN', 'OWNER'].includes(userProfile.orgUserRole);

  useMount(() => {
    dispatch(
      setHeader({
        layout: [
          {
            key: 'title',
            component: <GenericHeader>Documents & Agreements</GenericHeader>,
            alignItems: 'center',
          },
        ],
      }),
    );
  });

  const onBaaLabelClick = useCallback(() => {
    // setPreviewReady();
    // openPreview();
    downloadBAADocument();
  }, []);

  return (
    <DocumentsViewContainer container direction="column">
      {isUserAdmin && (
        <>
          <div>
            <DocumentImage alt="page" src={PdfPage} />
          </div>
          <Spacing vertical={4} />
          <MontserratTypography weight="normal" variant="h4">
            <div>Business Associate Agreement (BAA)</div>
            <Spacing vertical={2} />
            <DocumentLink onClick={onBaaLabelClick}>Download</DocumentLink>
          </MontserratTypography>
          <Spacing vertical={5} />
        </>
      )}
      <MontserratTypography weight="bold" variant="h3" gutterBottom>
        Links to Dock policies
      </MontserratTypography>
      <MontserratTypography weight="normal" variant="h4" gutterBottom>
        <DocumentLink
          href="https://www.dock.health/end-user-license-agreement"
          target="_blank"
        >
          End User License Agreement
        </DocumentLink>
      </MontserratTypography>
      <MontserratTypography weight="normal" variant="h4" gutterBottom>
        <DocumentLink
          href="https://www.dock.health/privacy-statement"
          target="_blank"
        >
          Privacy Statement
        </DocumentLink>
      </MontserratTypography>
      <MontserratTypography weight="normal" variant="h4" gutterBottom>
        <DocumentLink
          href="https://www.dock.health/terms-and-conditions"
          target="_blank"
        >
          Terms and Conditions
        </DocumentLink>
      </MontserratTypography>
      {/* {isPreviewReady && (
        <BaaPreview isPreviewOpen={isPreviewOpen} hidePreview={hidePreview} />
      )} */}
    </DocumentsViewContainer>
  );
};

export default DocumentsView;

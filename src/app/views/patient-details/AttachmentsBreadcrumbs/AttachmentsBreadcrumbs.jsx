import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import {
  currentFolderIdentifierSelector,
  currentPatientIdentifierSelector,
} from 'selectors/patient-details-selectors';
import { getPatientFolderStructureHierarchy } from 'api/patient-attachment-api';
import { createPatientAttachmentsPath } from 'routing/helpers/paths';
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbText,
  BreadcrumbWrapper,
} from './styled';

const AttachmentsBreadcrumbs = () => {
  const patientIdentifier = useSelector(currentPatientIdentifierSelector);
  const currentFolderIdentifier = useSelector(currentFolderIdentifierSelector);
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  useEffect(() => {
    setBreadcrumbs(null);

    if (currentFolderIdentifier) {
      getPatientFolderStructureHierarchy(currentFolderIdentifier).then(h => {
        const formattedFoldersHierarchy = [];
        let currentFolder = h;
        while (currentFolder) {
          formattedFoldersHierarchy.unshift({
            id: currentFolder.attachmentIdentifier,
            name: currentFolder.fileName,
          });
          currentFolder = currentFolder.parentAttachment;
        }
        setBreadcrumbs(formattedFoldersHierarchy);
      });
    }
  }, [currentFolderIdentifier]);

  return (
    <>
      {breadcrumbs && (
        <Box display="flex" overflow="hidden">
          <BreadcrumbLink to={createPatientAttachmentsPath(patientIdentifier)}>
            Files
          </BreadcrumbLink>
          {breadcrumbs.map(({ id, name }, index) => (
            <React.Fragment key={id}>
              {index === breadcrumbs.length - 3 && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbText>..</BreadcrumbText>
                </>
              )}
              {index === breadcrumbs.length - 2 && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbWrapper>
                    <BreadcrumbLink
                      to={createPatientAttachmentsPath(patientIdentifier, id)}
                    >
                      {name}
                    </BreadcrumbLink>
                  </BreadcrumbWrapper>
                </>
              )}
              {index === breadcrumbs.length - 1 && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbWrapper>
                    <BreadcrumbText>{name}</BreadcrumbText>
                  </BreadcrumbWrapper>
                </>
              )}
            </React.Fragment>
          ))}
        </Box>
      )}
    </>
  );
};

export default AttachmentsBreadcrumbs;

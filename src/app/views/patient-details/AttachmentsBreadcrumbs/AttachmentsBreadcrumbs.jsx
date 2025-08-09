import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbText,
  BreadcrumbWrapper,
} from './styled';
import { currentProfileTypeIdentifierSelector } from '@/app/selectors/profile-selector';
import {
  createPatientAttachmentsPath,
  createProfileAttachmentsPath,
} from '@/app/routing/helpers/paths';

const AttachmentsBreadcrumbs = ({
  entityIdentifierSelector,
  currentFolderIdentifierSelector,
  getFolderStructureHierarchy,
}) => {
  const entityIdentifier = useSelector(entityIdentifierSelector);
  const currentFolderIdentifier = useSelector(currentFolderIdentifierSelector);
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const profileTypeIndentifier = useSelector(
    currentProfileTypeIdentifierSelector,
  );

  useEffect(() => {
    setBreadcrumbs(null);
    if (currentFolderIdentifier) {
      getFolderStructureHierarchy(currentFolderIdentifier).then((folder) => {
        const formatted = [];
        let current = folder;
        while (current) {
          formatted.unshift({
            id: current.attachmentIdentifier,
            name: current.fileName,
          });
          current = current.parentAttachment;
        }
        setBreadcrumbs(formatted);
      });
    }
  }, [currentFolderIdentifier, getFolderStructureHierarchy]);

  return (
    <>
      {breadcrumbs && (
        <Box display="flex" overflow="hidden">
          <BreadcrumbLink
            to={
              profileTypeIndentifier
                ? createProfileAttachmentsPath(
                    profileTypeIndentifier,
                    entityIdentifier,
                  )
                : createPatientAttachmentsPath(entityIdentifier)
            }
          >
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
                      to={
                        profileTypeIndentifier
                          ? createProfileAttachmentsPath(
                              profileTypeIndentifier,
                              entityIdentifier,
                            )
                          : createPatientAttachmentsPath(entityIdentifier)
                      }
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

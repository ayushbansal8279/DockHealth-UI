import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
// import {
//   currentFolderIdentifierSelectorSelector,
//   currententityIdentifierSelectorSelector,
// } from 'selectors/patient-details-selectors';
// import { getFolderStructureHierarchy } from 'api/patient-attachment-api';
// import { createAttachmentsPath } from 'routing/helpers/paths';
import {
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbText,
  BreadcrumbWrapper,
} from './styled';

// const AttachmentsBreadcrumbs = ({entityIdentifierSelector,
//   currentFolderIdentifierSelector,
//   getFolderStructureHierarchy,
//   createAttachmentsPath,}) => {
//   // console.log(currententityIdentifierSelectorSelector);
  
  
//   // const entityIdentifierSelector = useSelector(currententityIdentifierSelectorSelector);
//   // const currentFolderIdentifierSelector = useSelector(currentFolderIdentifierSelectorSelector);

//   const [breadcrumbs, setBreadcrumbs] = useState(null);

//   useEffect(() => {
//     setBreadcrumbs(null);

//     if (currentFolderIdentifier) {
//       getFolderStructureHierarchy(currentFolderIdentifier,).then(
//         (folder) => {
//           const formattedFoldersHierarchy = [];
//           let currentFolder = folder;
//           while (currentFolder) {
//             formattedFoldersHierarchy.unshift({
//               id: currentFolder.attachmentIdentifier,
//               name: currentFolder.fileName,
//             });
//             currentFolder = currentFolder.parentAttachment;
//           }
//           setBreadcrumbs(formattedFoldersHierarchy);
//         },
//       );
//     }
//   }, [currentFolderIdentifierSelector]);

//   return (
//     <>
//       {breadcrumbs && (
//         <Box display="flex" overflow="hidden">
//           <BreadcrumbLink to={createAttachmentsPath(entityIdentifierSelector)}>
//             Files
//           </BreadcrumbLink>
//           {breadcrumbs.map(({ id, name }, index) => (
//             <React.Fragment key={id}>
//               {index === breadcrumbs.length - 3 && (
//                 <>
//                   <BreadcrumbSeparator />
//                   <BreadcrumbText>..</BreadcrumbText>
//                 </>
//               )}
//               {index === breadcrumbs.length - 2 && (
//                 <>
//                   <BreadcrumbSeparator />
//                   <BreadcrumbWrapper>
//                     <BreadcrumbLink
//                       to={createAttachmentsPath(entityIdentifierSelector, id)}
//                     >
//                       {name}
//                     </BreadcrumbLink>
//                   </BreadcrumbWrapper>
//                 </>
//               )}
//               {index === breadcrumbs.length - 1 && (
//                 <>
//                   <BreadcrumbSeparator />
//                   <BreadcrumbWrapper>
//                     <BreadcrumbText>{name}</BreadcrumbText>
//                   </BreadcrumbWrapper>
//                 </>
//               )}
//             </React.Fragment>
//           ))}
//         </Box>
//       )}
//     </>
//   );
// };

const AttachmentsBreadcrumbs = ({
  entityIdentifierSelector,
  currentFolderIdentifierSelector,
  getFolderStructureHierarchy,
  createAttachmentsPath,
}) => {

  const entityIdentifier = useSelector(entityIdentifierSelector);
  const currentFolderIdentifier = useSelector(currentFolderIdentifierSelector);
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  console.log(entityIdentifier);
  console.log(currentFolderIdentifier);
  
  
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

  const createPath = (id) => createAttachmentsPath(entityIdentifier, id);

  return (
    <>
      {breadcrumbs && (
        <Box display="flex" overflow="hidden">
          <BreadcrumbLink to={createPath()}>
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
                    <BreadcrumbLink to={createPath(id)}>
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

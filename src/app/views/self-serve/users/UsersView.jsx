import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import BasicLayoutHeader from 'components/template/BasicLayoutHeader/BasicLayoutHeader';
import UsersTable from './UsersTable/UsersTable';
import { UsersViewContainer, UsersViewOuterContainer } from './styled';
import LayoutHeader from '@/app/components/template/LayoutHeader/LayoutHeader';
import OptionsMenu from '@/app/components/common/OptionsMenu/OptionsMenu';
import { Box, Dialog } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import ImportDataModal from '@/app/modal/components/ImportDataModal/ImportDataModal';
import { bulkInviteUser, downloadUserInviteTemplate } from '@/app/api/organization-api';
import FileImportPopover from '@/app/components/common/FileImportPopover/FileImportPopover';

const UsersView = () => {
  const history = useHistory();

  const currentUser = useSelector(userProfileSelector);

  const isOwnerOrAdmin = checkIfUserIsOrganizationAdmin(currentUser);

  const [importPopupOpen, setImportPopupOpen] = useState(false);
  const [importPopoverOpen, setImportPopoverOpen] = useState(false);
  const [importResponse, setImportResponse] = useState(null);


  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(currentUser)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <>
      <ViewLayout
        header={
          <LayoutHeader>
            <Box
              position="absolute"
              top={27}
              left={10}
            >
              <OptionsMenu
                disablePortal
                options={[
                  isOwnerOrAdmin &&
                    {
                      name: 'Bulk Invite Users',
                      onClick: () => {
                        setImportPopupOpen(true);
                      },
                    }
                ]}
              >
                <MoreVert color="primary" />
              </OptionsMenu>
            </Box>
            <LayoutHeader.Title title="Users" />
          </LayoutHeader>
        }
      >
        <UsersViewOuterContainer>
          <UsersViewContainer>
            <UsersTable />
          </UsersViewContainer>
        </UsersViewOuterContainer>
      </ViewLayout>
      <Dialog
        open={importPopupOpen}
        onClose={() => setImportPopupOpen(false)}
        PaperProps={{
          elevation: 0,
          square: true,
          style: {},
        }}
      >
        <ImportDataModal
          closeModal={() => {
            setImportPopupOpen(false);
          }}
          downloadTemplate={downloadUserInviteTemplate}
          setImportPopoverOpen={setImportPopoverOpen}
          step={1}
          label="user"
          uploadFunction={bulkInviteUser}
          setImportResponse={setImportResponse}
        />
      </Dialog>
      {importPopoverOpen &&
        importResponse && (
          <FileImportPopover
            type="User"
            closePopover={() => {
              setImportPopoverOpen(false);
            }}
            uploadResponse={importResponse}
          />
        )
      }
  </>
  );
};

export default UsersView;

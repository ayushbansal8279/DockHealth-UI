import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Stack, Button, IconButton, CircularProgress } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { useDispatch } from 'react-redux';
import SearchInput from 'components/common/SearchInput/SearchInput';
import ToolbarButton from 'components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import { AddIcon } from '@/app/views/smart-flow-builder/TaskNodeHandles/styled';
import ReusableDataGrid from 'components/custom-profile/CustomProfilesList/DataGrid/DataGrid';
import { TabContent, ToolbarStack, DataGridContainer } from '../styled';
import { openModal, closeModal } from '@/app/modal/actions';
import { showGlobalErrorAlert } from '@/app/alert/actions';
import { getAllProfileTypesWithPredefined, deleteProfileType } from '@/app/api/profile-type-api';
import { MoreActionsWrapper } from 'views/person-details/PersonDetailsDrawer/styled';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import palette from 'styles/palette';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  userHasProfileBuilderFeatureSelector,
  userProfileSelector,
} from 'selectors/user-selectors';
import { getCustomerTypeLabel } from '@/app/helpers/customer-type-helper';
import { ContextType } from '@/app/helpers/custom-fields-helpers';

const ObjectsTab = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchPhrase, setSearchPhrase] = useState('');
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiRef = useGridApiRef();
  const userProfile = useSelector(userProfileSelector);
  const profileBuilderFeatureAvailable = useSelector(
    userHasProfileBuilderFeatureSelector,
  );
  const customerTypeLabel = getCustomerTypeLabel(userProfile);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const profileTypes = await getAllProfileTypesWithPredefined();
        const typeList = profileTypes.map((type) => ({
          ...type,
          id: type.identifier,
        }));
        setObjects(typeList || []);
      } catch (err) {
        setError(err.message);
        dispatch(showGlobalErrorAlert());
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [dispatch]);

  const handleSearchInputChange = (value) => {
    setSearchPhrase(value);
  };

  const onAddProfile = useCallback(() => {
    dispatch(
      openModal('CreateProfile', {
        onAdded: (newTemplate) => {
          const { identifier } = newTemplate;
          setObjects((s) => [...s, { id: identifier, ...newTemplate }]);
        },
        isCreatingNewField: true,
      }),
    );
  }, [dispatch]);

  const onEditProfile = useCallback(
    ({ row: { name, description, id } }) => {
      dispatch(
        openModal('CreateProfile', {
          onUpdated: (newTemplate) => {
            const { identifier } = newTemplate;
            setObjects((s) =>
              s.map((profile) =>
                profile.identifier === identifier
                  ? { ...profile, ...newTemplate }
                  : profile,
              ),
            );
          },
          isCreatingNewField: false,
          template: { name, description, identifier: id },
        }),
      );
    },
    [dispatch],
  );

  const onOpenProfileBuilder = useCallback(
    ({ row: { id, name, identifier } }) => {
      if (id.toLowerCase() === `${customerTypeLabel}s`) {
        history.push(`/settings/object-builder/${id.toLowerCase()}`);
        return;
      }
      history.push(`/settings/object-builder/objects/${identifier}`);
    },
    [history, customerTypeLabel],
  );

  const onDeleteProfile = useCallback(
    ({ id }) => {
      const modalProps = {
        title: 'Delete Object',
        description:
          'Are you sure you want to delete this object? This action cannot be undone.',
        confirm: () => {
          dispatch(closeModal());
          deleteProfileType(id);
          setObjects((s) => s.filter((t) => t.identifier !== id));
        },
      };
      dispatch(openModal('DeleteConfirmation', modalProps));
    },
    [dispatch],
  );

  const renderColumnHeader = (props) => {
    const { colDef } = props;
    const { headerName } = colDef;

    return (
      <div className="MuiDataGrid-colCellTitle">
        <span>{headerName}</span>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Object Name',
        flex: 0.5,
        renderHeader: renderColumnHeader,
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
        renderHeader: renderColumnHeader,
        renderCell: (params) => {
          return params.value || '';
        },
      },
      {
        field: 'contextType',
        headerName: 'Type',
        width: 150,
        flex: 0.2,
        renderHeader: renderColumnHeader,
        renderCell: (params) => {
          return params.value
            ? params.value.charAt(0) + params.value.slice(1).toLowerCase()
            : '';
        },
      },
      {
        field: '-',
        type: 'actions',
        headerName: 'Options',
        width: 100,
        renderHeader: renderColumnHeader,
        renderCell: (data) => {
          const contextMenuOptions = [];

          if (
            profileBuilderFeatureAvailable &&
            data.row.contextType !== ContextType.PREDEFINED
          ) {
            contextMenuOptions.push({
              name: 'Open Object Builder',
              onClick: () => onOpenProfileBuilder(data),
            });
          }

          if (data.row.contextType !== ContextType.PREDEFINED) {
            contextMenuOptions.push(
              {
                name: 'Edit',
                onClick: () => onEditProfile(data),
              },
              {
                name: 'Delete',
                color: palette.red,
                onClick: () => onDeleteProfile(data),
              },
            );
          }

          return (
            <MoreActionsWrapper>
              <OptionsMenu
                options={contextMenuOptions}
                customButtonComponent={IconButton}
              >
                <MoreVertIcon />
              </OptionsMenu>
            </MoreActionsWrapper>
          );
        },
      },
    ],
    [
      onEditProfile,
      onDeleteProfile,
      onOpenProfileBuilder,
      profileBuilderFeatureAvailable,
    ],
  );

  const filteredObjects = useMemo(() => {
    const filtered = !searchPhrase
      ? objects
      : objects.filter(
          (obj) =>
            obj.name?.toLowerCase().includes(searchPhrase.toLowerCase()) ||
            obj.description
              ?.toLowerCase()
              .includes(searchPhrase.toLowerCase()) ||
            obj.contextType?.toLowerCase().includes(searchPhrase.toLowerCase()),
        );

    return [...filtered].sort((a, b) => {
      if (
        a.contextType === ContextType.PREDEFINED &&
        b.contextType !== ContextType.PREDEFINED
      ) {
        return -1;
      }
      if (
        a.contextType !== ContextType.PREDEFINED &&
        b.contextType === ContextType.PREDEFINED
      ) {
        return 1;
      }
      return 0;
    });
  }, [objects, searchPhrase]);

  if (loading) {
    return (
      <TabContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </TabContent>
    );
  }

  if (error) {
    return (
      <TabContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <Box textAlign="center">
            <p>Error loading objects: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </Box>
        </Box>
      </TabContent>
    );
  }

  return (
    <TabContent>
      <ToolbarStack>
        <Box display="flex" alignItems="center" width="400px">
          <SearchInput
            value={searchPhrase}
            onValueChange={handleSearchInputChange}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <ToolbarButton
            icon={
              <span style={{ marginLeft: '-5px' }}>
                <AddIcon />
              </span>
            }
            onClick={onAddProfile}
          >
            Add Object
          </ToolbarButton>
        </Box>
      </ToolbarStack>
      <DataGridContainer>
        <ReusableDataGrid
          columns={columns}
          rows={filteredObjects}
          getRowId={(row) => row.identifier}
          apiRef={apiRef}
        />
      </DataGridContainer>
    </TabContent>
  );
};

export default ObjectsTab;

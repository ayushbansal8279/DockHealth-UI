import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Tooltip,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { useDispatch } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SearchInput from 'components/common/SearchInput/SearchInput';
import { AddIcon } from '@/app/views/smart-flow-builder/TaskNodeHandles/styled';
import ReusableDataGrid from 'components/common/ReusableDataGrid';
import { TabContent, ToolbarStack, DataGridContainer } from '../styled';
import ToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import { openModal } from '@/app/modal/actions';
import { showGlobalErrorAlert, showGlobalAlert } from '@/app/alert/actions';
import AlertMessages from '@/app/alert/AlertMessages';
import {
  deleteCustomField,
  getAllCustomFields,
  duplicateCustomField,
} from '@/app/api/custom-fields-api';
import { fieldTypes } from '@/app/components/profile-builder/helper';
import { TargetType, ContextType } from '@/app/helpers/custom-fields-helpers';

const FieldLibraryTab = ({ workspaceIdentifier, isWorkspace = false }) => {
  const dispatch = useDispatch();
  const [searchPhrase, setSearchPhrase] = useState('');
  const [fieldLibrary, setFieldLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const apiRef = useGridApiRef();

  const getFieldTypeInfo = (fieldType) => {
    return (
      fieldTypes.find((ft) => ft.fieldType === fieldType) || {
        placeholder: fieldType,
        img: null,
      }
    );
  };

  const formatObjectCase = (objectType) => {
    if (!objectType) return '';

    const specialCases = {
      PATIENT: 'Patient',
      USER: 'User',
      CAREGIVER: 'Caregiver',
      PHARMACY: 'Pharmacy',
      EQUIPMENT: 'Equipment',
      INSURANCE_COMPANY: 'Insurance Company',
      PROVIDER: 'Provider',
      TASK: 'Task',
      PROFILE: 'Profile',
    };

    if (specialCases[objectType]) {
      return specialCases[objectType];
    }

    return objectType
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getProfileTypeNames = (profileTypeDetails) => {
    if (!profileTypeDetails || !Array.isArray(profileTypeDetails)) return [];
    return profileTypeDetails.map((detail) => detail.name || 'Unknown');
  };

  const getCategoryFromContextType = (contextType) => {
    if (!contextType) return '';

    const contextTypeMap = {
      [ContextType.PREDEFINED]: 'Predefined',
      [ContextType.CUSTOM]: 'Custom',
    };

    return contextTypeMap[contextType] || contextType;
  };

  const fetchFields = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fields = await getAllCustomFields(workspaceIdentifier);
      setFieldLibrary(fields || []);
    } catch (err) {
      setError(err.message);
      dispatch(showGlobalErrorAlert());
    } finally {
      setLoading(false);
    }
  }, [workspaceIdentifier, dispatch]);

  useEffect(() => {
    if (!isWorkspace || workspaceIdentifier) {
      fetchFields();
    }
  }, [workspaceIdentifier]);

  const handleSearchInputChange = (value) => {
    setSearchPhrase(value);
  };

  const handleAddFieldClick = () => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'GLOBAL',
        },
        workspaceIdentifier,
        onAdded: (customField) => {
          setFieldLibrary((prev) => [...prev, customField]);
        },
      }),
    );
  };

  const handleEditFieldClick = (field) => {
    dispatch(
      openModal('EditCustomField', {
        options: {
          type: 'GLOBAL',
        },
        customField: field,
        workspaceIdentifier,
        onUpdated: (updatedField) => {
          setFieldLibrary((prev) =>
            prev.map((field) =>
              field.identifier === updatedField.identifier
                ? updatedField
                : field,
            ),
          );
        },
      }),
    );
  };

  const handleDeleteFieldClick = (field) => {
    dispatch(
      openModal('DeleteConfirmation', {
        title: 'Delete field',
        description:
          'Are you sure you want to delete this field from the library? This action cannot be undone.',
        confirm: async () => {
          try {
            await deleteCustomField(field.identifier, workspaceIdentifier);
            dispatch(showGlobalAlert(AlertMessages.DELETED));
            setFieldLibrary((prev) =>
              prev.filter((f) => f.identifier !== field.identifier),
            );
          } catch (err) {
            dispatch(showGlobalErrorAlert());
          }
        },
      }),
    );
  };

  const handleMenuClick = (event, field) => {
    setAnchorEl(event.currentTarget);
    setSelectedField(field);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuExited = () => {
    setSelectedField(null);
  };

  const handleChangeScopeClick = () => {
    dispatch(
      openModal('ScopeChange', {
        customField: selectedField,
        workspaceIdentifier,
        onScopeChanged: () => {
          fetchFields();
        },
      }),
    );
    handleMenuClose();
  };

  const handleDuplicateFieldClick = async (field) => {
    if (!field?.identifier) return;

    try {
      await duplicateCustomField(field.identifier);
      dispatch(showGlobalAlert(AlertMessages.CREATED));
      fetchFields();
    } catch (error) {
      console.error('Error duplicating field:', error);
      dispatch(showGlobalErrorAlert());
    }
  };

  const columns = useMemo(
    () => [
      {
        field: 'fieldType',
        headerName: 'Type',
        flex: 0.2,
        minWidth: 60,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const fieldTypeInfo = getFieldTypeInfo(params.value);
          return (
            <Tooltip title={fieldTypeInfo.placeholder} arrow>
              <Box
                sx={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0',
                }}
              >
                {fieldTypeInfo.img ? (
                  <img
                    src={fieldTypeInfo.img}
                    alt={fieldTypeInfo.placeholder}
                    style={{
                      width: '20px',
                      height: '20px',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      fontSize: '12px',
                      color: '#666',
                      fontWeight: 'bold',
                    }}
                  >
                    ?
                  </Box>
                )}
              </Box>
            </Tooltip>
          );
        },
      },
      {
        field: 'name',
        headerName: 'Field Name',
        flex: 1.25,
        minWidth: 200,
      },
      {
        field: 'contextType',
        headerName: 'Category',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const category = getCategoryFromContextType(params.value);
          return category || '';
        },
      },
      {
        field: 'profileTypeDetails',
        headerName: 'Objects',
        flex: 1.5,
        minWidth: 200,
        renderCell: (params) => {
          const profileTypeNames = getProfileTypeNames(params.value);

          if (profileTypeNames.length === 0) {
            return '';
          }

          return (
            <Box
              display="flex"
              alignItems="center"
              height="100%"
              gap={0.5}
              flexWrap="wrap"
            >
              {profileTypeNames.slice(0, 2).map((name, index) => (
                <Chip
                  key={index}
                  label={name}
                  size="small"
                  sx={{
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '12px',
                    height: '24px',
                    '& .MuiChip-label': {
                      padding: '0 8px',
                      fontWeight: 500,
                    },
                  }}
                />
              ))}
              {profileTypeNames.length > 2 && (
                <Chip
                  label={`+${profileTypeNames.length - 2}`}
                  size="small"
                  sx={{
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '12px',
                    height: '24px',
                    '& .MuiChip-label': {
                      padding: '0 8px',
                      fontWeight: 500,
                    },
                  }}
                />
              )}
            </Box>
          );
        },
      },
      {
        field: 'validationRegexDescription',
        headerName: 'Format',
        flex: 1,
        minWidth: 250,
        renderCell: (params) => {
          return params.value || '';
        },
      },
      {
        field: 'actions',
        headerName: 'Options',
        minWidth: 80,
        flex: 0.2,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" height="100%">
            <IconButton
              size="small"
              onClick={(e) => handleMenuClick(e, params.row)}
              sx={{ padding: '4px' }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [
      getFieldTypeInfo,
      formatObjectCase,
      getProfileTypeNames,
      getCategoryFromContextType,
    ],
  );

  const filteredFields = useMemo(() => {
    let filtered = fieldLibrary;

    if (isWorkspace) {
      filtered = filtered.filter(
        (field) => field.contextType !== ContextType.PREDEFINED,
      );
    }

    if (!searchPhrase) {
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
    }

    return filtered
      .filter((field) => {
        const searchLower = searchPhrase.toLowerCase();
        const profileTypeNames = getProfileTypeNames(field.profileTypeDetails);
        const category = getCategoryFromContextType(field.contextType);

        return (
          field.name?.toLowerCase().includes(searchLower) ||
          category?.toLowerCase().includes(searchLower) ||
          field.contextType?.toLowerCase().includes(searchLower) ||
          field.fieldType?.toLowerCase().includes(searchLower) ||
          field.validationRegexDescription
            ?.toLowerCase()
            .includes(searchLower) ||
          profileTypeNames.some((name) =>
            name.toLowerCase().includes(searchLower),
          )
        );
      })
      .sort((a, b) => {
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
  }, [
    fieldLibrary,
    searchPhrase,
    isWorkspace,
    getProfileTypeNames,
    getCategoryFromContextType,
  ]);

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
            <p>Error loading field library: {error}</p>
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
            onClick={handleAddFieldClick}
          >
            Add Field
          </ToolbarButton>
        </Box>
      </ToolbarStack>
      <DataGridContainer>
        <ReusableDataGrid
          columns={columns}
          rows={filteredFields}
          getRowId={(row) => row.identifier}
          apiRef={apiRef}
          loading={loading}
        />
      </DataGridContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onExited={handleMenuExited}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {selectedField?.contextType !== ContextType.PREDEFINED && (
          <MenuItem
            onClick={() => {
              handleEditFieldClick(selectedField);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {selectedField?.contextType !== ContextType.PREDEFINED && (
          <MenuItem onClick={handleChangeScopeClick}>
            <ListItemIcon>
              <SwapHorizIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Change Scope</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleDuplicateFieldClick(selectedField);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        {selectedField?.contextType !== ContextType.PREDEFINED && (
          <MenuItem
            onClick={() => {
              handleDeleteFieldClick(selectedField);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </TabContent>
  );
};

export default FieldLibraryTab;

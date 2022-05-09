import React, { useCallback, useEffect, useState } from 'react';
import Button from 'components/common/Button/Button';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { currentTaskTemplateIdentifierSelector } from 'selectors/task-template-selectors';
import Folder from 'img/folder';
import ArrowLeftIcon from 'img/arrow-left';
import debounce from 'lodash.debounce';

import { TaskTemplateType } from 'helpers/task-helpers';
import {
  getTemplatesForSpecificFolder,
  searchTemplates,
} from 'api/task-template-api';
import Search from 'components/task-view/Search/Search';
import {
  ModalWrapper,
  ModalDescriptionContainer,
  ModalHeader,
} from '../styled';
import {
  ArrowButton,
  DataGridWrapper,
  FolderIconContainer,
  ModalFooter,
  ModalHeaderContainer,
  ModalHeaderStyled,
  SearchStyled,
  StripedDataGrid,
} from './styled';

const SmartFlowListModal = ({ fetchMethod, closeModal, setWorkflow }) => {
  const [smartFlows, setSmartFlows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState(['/']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSmartFlow, setsSelectedSmartFlow] = useState({});
  const currentWorkflowIdentifier = useSelector(
    currentTaskTemplateIdentifierSelector,
  );

  const columns = [
    {
      field: 'workflowName',
      headerName: 'WORKFLOW NAME',
      width: 300,
      renderCell: props => {
        return props?.row?.type === TaskTemplateType.FOLDER ? (
          <FolderIconContainer>
            <img src={Folder} alt="folder icon" />
            <span>{props?.value}</span>
          </FolderIconContainer>
        ) : (
          <div>{props?.value ?? ''}</div>
        );
      },
      sortComparator: (v1, v2, parameter1, parameter2) => {
        const isFolder1 =
          parameter1.api.getCellValue(parameter1.id, 'type') ===
          TaskTemplateType.FOLDER
            ? 'true'
            : 'false';
        const isFolder2 =
          parameter2.api.getCellValue(parameter2.id, 'type') ===
          TaskTemplateType.FOLDER
            ? 'true'
            : 'false';
        const typeCompare = isFolder2.localeCompare(isFolder1);
        if (typeCompare === 0) {
          return parameter1.value.localeCompare(parameter2.value);
        }
        return typeCompare;
      },
    },
    { field: 'creator', headerName: 'CREATOR', width: 150 },
    {
      field: 'dateCreated',
      headerName: 'DATE CREATED',
      width: 170,
      sortComparator: (v1, v2) => {
        return Date.parse(v2) - Date.parse(v1);
      },
    },
    { field: 'type', hide: true },
  ];

  const sortModel = [
    {
      field: 'workflowName',
      sort: 'asc',
    },
  ];

  const mapDataToGrid = useCallback(
    data => {
      return data
        .filter(flow => flow.identifier !== currentWorkflowIdentifier)
        .map(flow => {
          return {
            id: flow.identifier,
            workflowName: flow.name,
            creator: flow.creator.name,
            dateCreated: moment(flow.createdDateTime).format('MM/DD/YYYY'),
            type: flow.templateType,
          };
        });
    },
    [currentWorkflowIdentifier],
  );

  const debouncedSearch = useCallback(
    debounce((searchPhrase = '') => {
      if (searchPhrase !== '' && searchPhrase.trim() === '') {
        return;
      }
      setIsLoading(true);
      if (searchPhrase.length > 1) {
        searchTemplates(searchPhrase).then(templatesList => {
          const data = mapDataToGrid(templatesList);
          setSmartFlows(data);
        });
      } else if (searchPhrase === '') {
        fetchMethod().then(data => {
          const flows = mapDataToGrid(data);
          setSmartFlows(flows);
        });
      }
      setIsLoading(false);
    }, 300),
    [],
  );

  const handleSearch = useCallback(
    searchPhrase => {
      setSearchTerm(searchPhrase);
      debouncedSearch(searchPhrase);
    },
    [debouncedSearch],
  );

  const removeItem = index => {
    setHistory([...history.slice(0, index), ...history.slice(index + 1)]);
  };

  const handleBack = () => {
    if (searchTerm !== '') {
      setSearchTerm('');
    }
    removeItem(history.length - 1);
  };

  const handleRowClick = ({ row }) => {
    if (row.type !== TaskTemplateType.FOLDER) {
      setsSelectedSmartFlow({
        identifier: row.id,
        workflowName: row.workflowName,
      });
      return;
    }

    if (history?.length >= 1) {
      setHistory([...history, row.id]);
    } else {
      setHistory(['/']);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (history.length === 1) {
      fetchMethod().then(data => {
        const flows = mapDataToGrid(data);
        setIsLoading(false);
        setSmartFlows(flows);
      });
    } else {
      getTemplatesForSpecificFolder(history.slice(-1)[0]).then(data => {
        const flow2s = mapDataToGrid(data);
        setSmartFlows(flow2s);
      });
      setIsLoading(false);
    }
  }, [closeModal, fetchMethod, history, mapDataToGrid]);

  return (
    <ModalWrapper width="700px">
      <ModalHeaderContainer>
        <ModalHeaderStyled>
          {history.length > 1 && (
            <ArrowButton onClick={handleBack}>
              <img src={ArrowLeftIcon} alt="back-navigation" />
            </ArrowButton>
          )}
          <ModalHeader textAlign="left">Choose Smartflow</ModalHeader>
        </ModalHeaderStyled>
        <SearchStyled>
          <Search
            fullWidth
            noBackground
            value={searchTerm}
            onChange={event => handleSearch(event?.target?.value)}
            placeholder="Search Workflows"
          />
        </SearchStyled>
      </ModalHeaderContainer>
      <ModalDescriptionContainer>
        <DataGridWrapper>
          <StripedDataGrid
            sortingOrder={['desc', 'asc']}
            loading={isLoading}
            sortModel={sortModel}
            rows={smartFlows}
            columns={columns}
            hideFooterSelectedRowCount
            disableColumnSelector
            disableColumnMenu
            rowHeight={35}
            editMode="row"
            hideFooter
            onRowClick={handleRowClick}
          />
        </DataGridWrapper>
      </ModalDescriptionContainer>
      <ModalFooter>
        <Button
          uppercase
          width="150px"
          onClick={closeModal}
          variant="secondary"
        >
          cancel
        </Button>
        <Button
          uppercase
          width="150px"
          variant="primary"
          onClick={() => {
            setWorkflow(selectedSmartFlow);
            closeModal();
          }}
        >
          connect
        </Button>
      </ModalFooter>
    </ModalWrapper>
  );
};

export default SmartFlowListModal;

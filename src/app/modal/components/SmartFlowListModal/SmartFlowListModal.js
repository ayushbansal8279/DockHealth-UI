import React, { useCallback, useEffect, useState } from 'react';
import Button from 'components/common/Button/Button';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { currentTaskTemplateIdentifierSelector } from 'selectors/task-template-selectors';
import Folder from 'img/folder';
import ArrowLeftIcon from 'img/arrow-left';

import { TaskTemplateType } from 'helpers/task-helpers';
import { getTemplatesForSpecificFolder } from 'api/task-template-api';
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
  StripedDataGrid,
} from './styled';

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
  },
  { field: 'creator', headerName: 'CREATOR', width: 150 },
  {
    field: 'dateCreated',
    headerName: 'DATE CREATED',
    width: 170,
  },
  { field: 'type', hide: true },
];

const SmartFlowListModal = ({ fetchMethod, closeModal, setWorkflow }) => {
  const [smartFlows, setSmartFlows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState(['/']);
  const [selectedSmartFlow, setsSelectedSmartFlow] = useState({});
  const currentWorkflowIdentifier = useSelector(
    currentTaskTemplateIdentifierSelector,
  );

  const mapDataToGrid = useCallback(
    data => {
      return data
        .filter(flow => flow.identifier !== currentWorkflowIdentifier)
        .map(flow => {
          return {
            id: flow?.identifier,
            workflowName: flow?.name,
            creator: flow?.creator.name,
            dateCreated: moment(flow?.createdDateTime).format('MM/DD/YYYY'),
            type: flow?.templateType,
          };
        });
    },
    [currentWorkflowIdentifier],
  );

  // useEffect(() => {
  //   fetchMethod()
  //     .then(data => {
  //       const flows = mapDataToGrid(data);
  //       setIsLoading(false);
  //       setSmartFlows(flows);
  //     })
  //     .catch(() => {
  //       closeModal();
  //     });
  // }, [fetchMethod, closeModal, currentWorkflowIdentifier, mapDataToGrid]);

  const removeItem = index => {
    setHistory([...history.slice(0, index), ...history.slice(index + 1)]);
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
    if (history.length === 1) {
      fetchMethod()
        .then(data => {
          const flows = mapDataToGrid(data);
          setIsLoading(false);
          setSmartFlows(flows);
        })
        .catch(() => {
          closeModal();
        });
    } else {
      setIsLoading(true);
      getTemplatesForSpecificFolder(history.slice(-1)[0]).then(data => {
        const flow2s = mapDataToGrid(data);
        setIsLoading(false);
        setSmartFlows(flow2s);
      });
    }
  }, [closeModal, fetchMethod, history, mapDataToGrid]);

  return (
    <ModalWrapper width="700px">
      <ModalHeaderContainer>
        {history.length > 1 && (
          <ArrowButton onClick={() => removeItem(history.length - 1)}>
            <img src={ArrowLeftIcon} alt="back-navigation" />
          </ArrowButton>
        )}
        <ModalHeader textAlign="left">Choose Smartflow</ModalHeader>
      </ModalHeaderContainer>
      <ModalDescriptionContainer>
        <DataGridWrapper>
          <StripedDataGrid
            loading={isLoading}
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

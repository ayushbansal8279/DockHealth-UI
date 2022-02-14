/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useState, useCallback } from 'react';
import { useBoolean } from 'hooks/useBoolean';
import palette from 'styles/palette';
import Spacing from 'components/common/Spacing';
import { RotatableHeaderChevron } from 'components/common/RotatableChevron/RotatableChevron';
import debounce from 'lodash.debounce';
import {
  getTemplates,
  getTemplatesForSpecificFolder,
  searchTemplates,
} from 'api/task-template-api';
import TaskTemplatePopover from './TaskTemplatePopover';
import {
  TaskTemplateApplicatorContainer,
  TaskTemplateApplicatorLabel,
} from './styled';

const TaskTemplateApplicator = ({ onTemplateSelect }) => {
  const popoverReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);
  const [searchValue, setSearchValue] = useState('');
  const [parentList, setParentList] = useState([]);
  const [taskTemplatesList, setTaskTemplatesList] = useState(null);
  const [taskTemplatesIsLoading, setTaskTemplatesIsLoading] = useState(null);

  const getNestedTemplatesList = useCallback(
    identifier => {
      setTaskTemplatesIsLoading(true);
      getTemplatesForSpecificFolder(identifier)
        .then(templatesList => {
          setTaskTemplatesList(templatesList);
          setTaskTemplatesIsLoading(false);
        })
        .catch(() => {
          setTaskTemplatesIsLoading(false);
        });
    },
    [setTaskTemplatesIsLoading],
  );

  const getRootTemplatesList = useCallback(() => {
    setTaskTemplatesIsLoading(true);
    setParentList([]);
    getTemplates()
      .then(templatesList => {
        setTaskTemplatesList(templatesList);
        setTaskTemplatesIsLoading(false);
      })
      .catch(() => {
        setTaskTemplatesIsLoading(false);
      });
  }, [setTaskTemplatesIsLoading]);

  const handleTemplateSelect = useCallback(
    template => {
      onTemplateSelect(template);
      closePopover();
    },
    [closePopover, onTemplateSelect],
  );

  const handleClose = useCallback(() => {
    closePopover();
    setSearchValue('');
    setParentList([]);
  }, [closePopover, setSearchValue, setParentList]);

  const handleFolderClick = useCallback(
    folder => {
      setParentList([...(parentList || []), folder]);
      getNestedTemplatesList(folder.identifier);
    },
    [getNestedTemplatesList, parentList],
  );

  const handleBack = useCallback(() => {
    const slicedPatientList = [...parentList.slice(0, -1)];
    setParentList(slicedPatientList);

    if (slicedPatientList.length > 0) {
      getNestedTemplatesList(
        slicedPatientList[slicedPatientList.length - 1].identifier,
      );
    } else {
      getRootTemplatesList();
    }
  }, [getRootTemplatesList, getNestedTemplatesList, parentList]);

  const debouncedSearch = useCallback(
    debounce((searchPhrase = '') => {
      if (searchPhrase !== '' && searchPhrase.trim() === '') {
        return;
      }
      if (searchPhrase.length > 2) {
        setParentList([]);
        setTaskTemplatesIsLoading(true);
        searchTemplates(searchPhrase)
          .then(templatesList => {
            setTaskTemplatesList(templatesList);
            setTaskTemplatesIsLoading(false);
          })
          .catch(() => {
            setTaskTemplatesIsLoading(false);
          });
      } else if (searchPhrase === '') {
        getRootTemplatesList();
      }
    }, 300),
    [],
  );

  const handleSearch = useCallback(
    searchPhrase => {
      setSearchValue(searchPhrase);
      debouncedSearch(searchPhrase);
    },
    [setSearchValue, debouncedSearch],
  );

  return (
    <>
      <TaskTemplateApplicatorContainer
        onClick={openPopover}
        ref={popoverReference}
      >
        <TaskTemplateApplicatorLabel>
          Use a workflow
        </TaskTemplateApplicatorLabel>
        <Spacing horizontal={3} />
        <RotatableHeaderChevron
          rotated={isPopoverOpen}
          color={palette.oPlusRed}
        />
      </TaskTemplateApplicatorContainer>
      <TaskTemplatePopover
        anchorEl={popoverReference.current}
        open={isPopoverOpen}
        onClose={handleClose}
        taskTemplatesList={taskTemplatesList}
        taskTemplatesIsLoading={taskTemplatesIsLoading}
        onSearchChange={handleSearch}
        searchPhrase={searchValue}
        onFolderClick={handleFolderClick}
        onTemplateSelect={handleTemplateSelect}
        getTemplatesList={getRootTemplatesList}
        parentList={parentList[parentList.length - 1]}
        onBack={handleBack}
      />
    </>
  );
};

export default TaskTemplateApplicator;

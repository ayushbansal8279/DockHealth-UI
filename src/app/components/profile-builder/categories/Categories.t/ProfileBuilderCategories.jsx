import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import TEXT from 'img/profile-builder/ShortText.svg';
import LONG_TEXT from 'img/profile-builder/RichText.svg';
import DATE from 'img/profile-builder/Calender.svg';
import NUMBER from 'img/profile-builder/Hash.svg';
import BOOLEAN from 'img/profile-builder/Boolean.svg';
import HYPERLINK from 'img/profile-builder/Link.svg';
import PICK_LIST from 'img/profile-builder/DropDown.svg';
import RELATIONSHIP from 'img/profile-builder/Profile.svg';
import {
  CategoryContainer,
  CategoryTitle,
  SingleFieldWrapper,
  CategoryWrapper,
  ExistingFieldsSection,
  ExistingFieldsContent,
  ExistingFieldsList,
  EmptyStateContainer,
  EmptyStateMessage,
  EmptyStateHint,
  PaginationContainer,
  SearchFieldWrapper,
} from './styled';
import { Box, Pagination, Typography } from '@mui/material';
import { FieldType, fieldTypes } from '../../helper';
import Spacing from '@/app/components/common/Spacing';
import TextField from '../../TextField';
import { useDroppable } from '@dnd-kit/core';
import AddCategory from './AddCategory';
import AddNewFieldsCategory from './AddNewFieldsCategory';
import AddExistingFieldsCategory from './AddExistingFieldsCategory';
import { ProfileBuilderContext } from '../../ProfileBuilder';

const FieldTypeImages = {
  [FieldType.TEXT]: TEXT,
  [FieldType.LONG_TEXT]: LONG_TEXT,
  [FieldType.DATE]: DATE,
  [FieldType.NUMBER]: NUMBER,
  [FieldType.BOOL]: BOOLEAN,
  [FieldType.HYPERLINK]: HYPERLINK,
  [FieldType.DROPDOWN]: PICK_LIST,
  [FieldType.DROPDOWN_MULTI]: PICK_LIST,
  [FieldType.RELATIONSHIP]: RELATIONSHIP,
};

const ProfileBuilderCategories = ({ allCustomFields }) => {
  const [searchedCustomField, setSearchedCustomField] =
    useState(allCustomFields);
  const [searchTextValue, setSearchTextValue] = useState('');
  const { activeDragItem } = useContext(ProfileBuilderContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const listContainerRef = useRef(null);
  const resizeObserverRef = useRef(null);

  useEffect(() => {
    setSearchedCustomField(allCustomFields);
    setCurrentPage(1);
  }, [allCustomFields]);

  const calculateItemsPerPage = useCallback(() => {
    if (!listContainerRef.current) return;

    const container = listContainerRef.current;
    const availableHeight = container.clientHeight;

    if (availableHeight <= 0) {
      const isMobile = window.innerWidth <= 1024;
      setItemsPerPage(isMobile ? 4 : 8);
      return;
    }

    const itemHeight = 44;
    const gap = 10;

    const isMobile = window.innerWidth <= 1024;
    const columnsPerRow = isMobile ? 1 : 2;

    const rowsPerPage = Math.max(
      1,
      Math.floor((availableHeight + gap) / (itemHeight + gap)),
    );

    const calculatedItemsPerPage = rowsPerPage * columnsPerRow;

    setItemsPerPage(Math.max(2, calculatedItemsPerPage));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!listContainerRef.current) return;

      calculateItemsPerPage();

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserverRef.current = new ResizeObserver(() => {
          requestAnimationFrame(() => {
            calculateItemsPerPage();
          });
        });

        resizeObserverRef.current.observe(listContainerRef.current);
      }
    }, 0);

    const handleResize = () => {
      requestAnimationFrame(() => {
        calculateItemsPerPage();
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateItemsPerPage]);

  const handleTextChange = (value) => {
    setSearchTextValue(value);
    const filteredList = allCustomFields.filter((item) =>
      item?.name?.toLowerCase().includes(value.toLowerCase()),
    );

    setSearchedCustomField(filteredList);
    setCurrentPage(1);
  };

  const { setNodeRef: addNewFieldsDropRef } = useDroppable({
    id: 'add-fields-area-source',
  });

  const { setNodeRef: addExistingFieldsDropRef } = useDroppable({
    id: 'add-existing-fields-area-source',
  });

  const paginatedFields = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return searchedCustomField.slice(start, start + itemsPerPage);
  }, [searchedCustomField, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(searchedCustomField.length / itemsPerPage);
  const hasResults = searchedCustomField.length > 0;

  useEffect(() => {
    if (hasResults && currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, hasResults, itemsPerPage]);

  const startIndex = hasResults ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = hasResults
    ? Math.min(currentPage * itemsPerPage, searchedCustomField.length)
    : 0;

  return (
    <CategoryContainer>
      <CategoryWrapper isDragging={!!activeDragItem}>
        <Box>
          <CategoryTitle>Add Category</CategoryTitle>
          <AddCategory />
        </Box>
        <Box mt={3}>
          <CategoryTitle>Add New Fields</CategoryTitle>
          <SingleFieldWrapper ref={addNewFieldsDropRef}>
            {fieldTypes.map((item) => {
              const isTrauncated = item.placeholder.length >= 15;
              return (
                <AddNewFieldsCategory
                  key={`add-fields-area-source-${item?.index}`}
                  item={item}
                  isTrauncated={isTrauncated}
                  fieldTypeImages={FieldTypeImages}
                />
              );
            })}
          </SingleFieldWrapper>
        </Box>
        <Box
          mt={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
          }}
        >
          <CategoryTitle>Add Existing Fields</CategoryTitle>
          <ExistingFieldsSection>
            <SearchFieldWrapper>
              <TextField
                border
                size="small"
                placeholder="Search Existing Field"
                width="100%"
                value={searchTextValue}
                onChange={handleTextChange}
              />
            </SearchFieldWrapper>
            <Spacing vertical={4} />
            <ExistingFieldsContent>
              <ExistingFieldsList
                ref={(node) => {
                  listContainerRef.current = node;
                  addExistingFieldsDropRef(node);
                }}
              >
                {paginatedFields.length > 0 ? (
                  <SingleFieldWrapper>
                    {paginatedFields.map((item, index) => (
                      <AddExistingFieldsCategory
                        key={item.id || item.identifier}
                        item={item}
                        isTrauncated={item.name.length >= 15}
                        fieldTypeImages={FieldTypeImages}
                        index={index}
                      />
                    ))}
                  </SingleFieldWrapper>
                ) : (
                  <EmptyStateContainer>
                    <EmptyStateMessage>
                      No fields found matching your search.
                    </EmptyStateMessage>
                    <EmptyStateHint>
                      Try a different search term or add a new field above.
                    </EmptyStateHint>
                  </EmptyStateContainer>
                )}
              </ExistingFieldsList>

              {hasResults && (
                <PaginationContainer>
                  <Pagination
                    count={Math.max(1, totalPages)}
                    page={currentPage}
                    onChange={(_, val) => setCurrentPage(val)}
                    size="small"
                  />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {`${startIndex} - ${endIndex} of ${searchedCustomField.length}`}
                  </Typography>
                </PaginationContainer>
              )}
            </ExistingFieldsContent>
          </ExistingFieldsSection>
        </Box>
      </CategoryWrapper>
    </CategoryContainer>
  );
};

export default ProfileBuilderCategories;

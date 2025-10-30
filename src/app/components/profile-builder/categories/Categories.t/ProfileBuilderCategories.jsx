import React, { useContext, useEffect, useMemo, useState } from 'react';
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
  const [searchTextValue, setSearchTextValue] = useState(allCustomFields);
  const { activeDragItem } = useContext(ProfileBuilderContext);

  useEffect(() => {
    setSearchedCustomField(allCustomFields);
  }, [allCustomFields]);

  const handleTextChange = (value) => {
    setSearchTextValue(value);
    const filteredList = allCustomFields.filter((item) =>
      item?.name?.toLowerCase().includes(value.toLowerCase()),
    );

    setSearchedCustomField(filteredList);
  };

  const { setNodeRef: addNewFieldsDropRef } = useDroppable({
    id: 'add-fields-area-source',
  });

  const { setNodeRef: addExistingFieldsDropRef } = useDroppable({
    id: 'add-existing-fields-area-source',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const paginatedFields = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return searchedCustomField.slice(start, start + itemsPerPage);
  }, [searchedCustomField, currentPage]);

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
        <Box mt={3}>
          <CategoryTitle>Add Existing Fields</CategoryTitle>
          <Box>
            <TextField
              border
              size="small"
              placeholder="Search Existing Field"
              width="48%"
              value={searchTextValue}
              onChange={handleTextChange}
            />
            <Spacing vertical={4} />
            <Box
              sx={{
                maxHeight: '210px',
                overflowY: 'auto',
                pr: 1,
              }}
            >
              <SingleFieldWrapper>
                {paginatedFields.map((item, index) => (
                  <AddExistingFieldsCategory
                    key={item.id}
                    item={item}
                    isTrauncated={item.name.length >= 15}
                    fieldTypeImages={FieldTypeImages}
                    index={index}
                  />
                ))}
              </SingleFieldWrapper>
            </Box>

            {searchedCustomField.length > itemsPerPage && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                }}
              >
                <Typography>
                  {currentPage * itemsPerPage - itemsPerPage + 1} -{' '}
                  {Math.min(
                    currentPage * itemsPerPage,
                    searchedCustomField.length,
                  )}{' '}
                  of {searchedCustomField.length}
                </Typography>

                <Pagination
                  count={Math.ceil(searchedCustomField.length / itemsPerPage)}
                  page={currentPage}
                  onChange={(_, val) => setCurrentPage(val)}
                  size="small"
                />
              </Box>
            )}
          </Box>
        </Box>
      </CategoryWrapper>
    </CategoryContainer>
  );
};

export default ProfileBuilderCategories;

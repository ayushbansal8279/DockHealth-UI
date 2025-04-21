import React, { useEffect, useState } from 'react';
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
  AddCategory,
  CategoryTitle,
  CategoryLabel,
  SingleFieldWrapper,
  SingleField,
  CategoryWrapper,
} from './styled';
import { Box } from '@mui/material';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { FieldType, fieldTypes } from '../../helper';
import Spacing from '@/app/components/common/Spacing';
import TextField from '../../TextField';
import Tooltip from '@/app/components/common/Tooltip/Tooltip';

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

  return (
    <CategoryContainer>
      <CategoryWrapper>
        <Box>
          <CategoryTitle>Add Category</CategoryTitle>
          <Droppable isDropDisabled droppableId="add-category-area-source">
            {(provided) => {
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Draggable draggableId="add-category" index={0}>
                    {(provided) => (
                      <AddCategory
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        Add Category
                      </AddCategory>
                    )}
                  </Draggable>
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </Box>
        <Box mt={4}>
          <CategoryTitle>Add New Fields</CategoryTitle>
          <Droppable isDropDisabled droppableId="add-fields-area-source">
            {(provided) => (
              <SingleFieldWrapper
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {fieldTypes.map((item) => {
                  const isTrauncated = item.placeholder.length >= 15;
                  return (
                    <Draggable draggableId={item.fieldType} index={item.index}>
                      {(provided) => (
                        <SingleField
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <img
                            style={{ width: 20 }}
                            src={FieldTypeImages[item?.fieldType]}
                            alt={item.name}
                          />
                          {isTrauncated ? (
                            <Tooltip placement="top" title={item.placeholder}>
                              <CategoryLabel>{item.placeholder}</CategoryLabel>
                            </Tooltip>
                          ) : (
                            <CategoryLabel>{item.placeholder}</CategoryLabel>
                          )}
                        </SingleField>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </SingleFieldWrapper>
            )}
          </Droppable>
        </Box>
        <Spacing vertical={6} />
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
          <Box>
            <Droppable
              isDropDisabled
              droppableId="add-existing-fields-area-source"
            >
              {(provided) => (
                <SingleFieldWrapper
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {searchedCustomField?.slice(0, 8).map((item, index) => {
                    const isTrauncated = item.name.length >= 15;
                    return (
                      <Draggable
                        draggableId={item.identifier + `#${index}`}
                        index={item.sortIndex}
                      >
                        {(provided) => (
                          <SingleField
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div>
                              <img
                                style={{ width: 15 }}
                                src={FieldTypeImages[item?.fieldType]}
                                alt={item.name}
                              />
                            </div>
                            {isTrauncated ? (
                              <Tooltip placement="top" title={item.name}>
                                <CategoryLabel>{item.name}</CategoryLabel>
                              </Tooltip>
                            ) : (
                              <CategoryLabel>{item.name}</CategoryLabel>
                            )}
                          </SingleField>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </SingleFieldWrapper>
              )}
            </Droppable>
          </Box>
        </Box>
      </CategoryWrapper>
    </CategoryContainer>
  );
};

export default ProfileBuilderCategories;

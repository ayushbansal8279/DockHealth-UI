import React, { SetStateAction, useState } from 'react';
import BasicLayoutHeader from '../template/BasicLayoutHeader/BasicLayoutHeader';
import ProfileBuilderCategories from './categories/Categories.t/ProfileBuilderCategories';
import { BuilderContainer, CategoryWrapper, PlayGroungWrapper } from './styled';
import BuilderPlayground from './builder-playground/BuilderPlayground';
import { DragDropContext, DragStart, DropResult } from 'react-beautiful-dnd';
import { useBoolean } from 'hooks/useBoolean';
import { Field, DROPTYPE, Category } from './helper';
import { dummyFields } from './helper';

const ProfileBuilder = () => {
  const [isAddCategoryDrop, setAddCategoryDrop, unsetAddCategoryDrop] =
    useBoolean(false);
  const [isAddFieldDrop, setAddFieldDrop, unsetAddFieldDrop] =
    useBoolean(false);

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  // const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [isNewCategory, setNewCategory] = useState(false);

  const handleDragEnd = (e: DropResult) => {
    // console.log(e);
    const source = e.source.droppableId;
    const destination = e.destination?.droppableId;

    if (
      source === DROPTYPE.AddCategory &&
      destination === 'add-category-area'
    ) {
      setNewCategory(true);
    }

    if (source === DROPTYPE.AddCategory) unsetAddCategoryDrop();
    if (source === DROPTYPE.AddField) unsetAddFieldDrop();

    dummyFields.map((field: Field) => {
      if (source === DROPTYPE.AddField) {
        if (e.draggableId === field.dragId) {
          setSelectedCategories((prev) =>
            prev.map((category) =>
              category.fieldDropId === destination
                ? { ...category, fields: [...category.fields, field] }
                : category,
            ),
          );
          // setSelectedFields((prev: Field[]) => [...prev, field]);
        }
      }
    });
  };
  const handleDragStart = (e: DragStart) => {
    const source = e.source.droppableId;
    // console.log(e);
    if (source === DROPTYPE.AddCategory) setAddCategoryDrop();
    if (source === DROPTYPE.AddField) setAddFieldDrop();
  };
  return (
    <>
      <BasicLayoutHeader title={'Profile/ Profile Builder'} />
      <DragDropContext
        onDragStart={(e) => handleDragStart(e)}
        onDragEnd={(e) => handleDragEnd(e)}
      >
        <BuilderContainer>
          <PlayGroungWrapper>
            <BuilderPlayground
              isAddCategoryDrop={isAddCategoryDrop}
              isAddFieldDrop={isAddFieldDrop}
              isNewCategory={isNewCategory}
              setNewCategory={setNewCategory}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </PlayGroungWrapper>
          <CategoryWrapper>
            <ProfileBuilderCategories />
          </CategoryWrapper>
        </BuilderContainer>
      </DragDropContext>
    </>
  );
};

export default ProfileBuilder;

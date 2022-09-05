import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Grid } from '@material-ui/core';
import InfoIcon from 'img/info';
import SearchIcon from 'img/search-headsup';
import SearchClearIcon from 'img/search-clear';
import Video from 'components/common/Video/Video';
import spacing from 'styles/spacing';
import Spacing from 'components/common/Spacing';
import LabeledCollapse from 'components/common/LabeledCollapse/LabeledCollapse';
import { EDUCATION_CENTER_CATEGORIES } from './education-center-data';
import {
  EducationCenterWrapper,
  EducationCenterFooter,
  EducationCenterList,
  EducationCenterTitle,
  FooterInfoText,
  FooterLink,
  FooterIcon,
  CategoryName,
  EducationOverviewText,
  EducationItemLink,
  EducationItemTourButton,
  EducationSearchInput,
} from './styled';

const EducationCenterSubmenu = () => {
  const searchInputReference = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [openedItem, setOpenedItem] = useState(null);
  const history = useHistory();

  const filteredCategories = useMemo(() => {
    const searchValueLowerCase = searchValue.toLowerCase();

    if (!searchValueLowerCase) {
      return EDUCATION_CENTER_CATEGORIES;
    }

    return EDUCATION_CENTER_CATEGORIES.reduce((accumulator, category) => {
      const itemsToReturn = category.items.filter(
        ({ name, overview, additionalOverview }) =>
          name.toLowerCase().includes(searchValueLowerCase) ||
          overview?.toLowerCase().includes(searchValueLowerCase) ||
          additionalOverview?.toLowerCase().includes(searchValueLowerCase),
      );

      if (itemsToReturn?.length > 0) {
        return [...accumulator, { ...category, items: itemsToReturn }];
      }

      return accumulator;
    }, []);
  }, [searchValue]);

  useEffect(() => {
    if (filteredCategories?.length > 0 && searchValue) {
      setOpenedItem(filteredCategories[0].items?.[0].name || null);
    }

    if (!searchValue && openedItem) {
      setOpenedItem(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredCategories]);

  const handleClearSearch = () => {
    setSearchValue('');
    // eslint-disable-next-line no-unused-expressions
    searchInputReference.current?.focus();
  };

  return (
    <EducationCenterWrapper>
      <Grid container alignItems="center">
        <button
          type="button"
          onClick={() => searchInputReference.current?.focus()}
        >
          <img src={SearchIcon} alt="Search" />
        </button>
        <Spacing horizontal={3} />
        <EducationSearchInput
          ref={searchInputReference}
          value={searchValue}
          onChange={event => setSearchValue(event.target?.value || '')}
        />
        {searchValue && (
          <>
            <Spacing horizontal={3} />
            <button type="button" onClick={handleClearSearch}>
              <img src={SearchClearIcon} alt="clear" />
            </button>
          </>
        )}
      </Grid>
      <EducationCenterTitle>Education Center</EducationCenterTitle>
      <EducationCenterList>
        {filteredCategories.map(category => (
          <Box
            key={category.name}
            width="100%"
            mb={spacing.smallPlus}
            pb={spacing.smallPlus}
          >
            <CategoryName>{category.name}</CategoryName>
            {category.items.map(item => (
              <LabeledCollapse
                key={item.name}
                onClick={() =>
                  setOpenedItem(previousOpenedItem =>
                    previousOpenedItem === item.name ? null : item.name,
                  )
                }
                name={item.name}
                isOpened={openedItem === item.name}
              >
                <Box width="100%" py={spacing.small}>
                  {item.videoUrl && (
                    <>
                      <Video url={item.videoUrl} />
                      <Spacing vertical={4} />
                    </>
                  )}
                  {item.overview && (
                    <>
                      <EducationOverviewText>
                        {item.overview}
                      </EducationOverviewText>
                      {item.additionalOverview && (
                        <>
                          <Spacing vertical={4} />
                          <EducationOverviewText>
                            {item.additionalOverview}
                          </EducationOverviewText>
                        </>
                      )}
                    </>
                  )}
                  {item.helpUrl && (
                    <>
                      <Spacing vertical={4} />
                      <EducationItemLink
                        href={item.helpUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.helpUrlLabel || 'More Details'}
                      </EducationItemLink>
                    </>
                  )}
                  {item.productTourUrl && (
                    <>
                      <Spacing vertical={4} />
                      <EducationItemTourButton
                        onClick={() => history.push(item.productTourUrl)}
                      >
                        Step by Step
                      </EducationItemTourButton>
                    </>
                  )}
                </Box>
              </LabeledCollapse>
            ))}

            {/* ------ */}
          </Box>
        ))}
      </EducationCenterList>
      <EducationCenterFooter>
        <FooterIcon>
          <InfoIcon size={17} />
        </FooterIcon>
        <FooterInfoText>
          Can&apos;t find what you’re looking for?
        </FooterInfoText>
        <FooterLink
          href="https://help.dock.health"
          target="_blank"
          rel="noreferrer"
        >
          Visit our help center
        </FooterLink>
      </EducationCenterFooter>
    </EducationCenterWrapper>
  );
};

export default EducationCenterSubmenu;

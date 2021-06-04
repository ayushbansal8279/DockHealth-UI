import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Collapse } from '@material-ui/core';
import InfoIcon from 'img/info';
import RotatableChevron from 'components/common/RotatableChevron/RotatableChevron';
import Video from 'components/common/Video/Video';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import Spacing from 'components/common/Spacing';
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
  EducationItem,
  EducationItemName,
  EducationItemHeaderButton,
  EducationOverviewText,
  EducationItemLink,
  EducationItemTourButton,
} from './styled';

const EducationCenterSubmenu = () => {
  const [openedItem, setOpenedItem] = useState(null);
  const history = useHistory();

  return (
    <EducationCenterWrapper>
      <EducationCenterTitle>Education Center</EducationCenterTitle>
      <EducationCenterList>
        {EDUCATION_CENTER_CATEGORIES.map(category => (
          <Box
            key={category.name}
            width="100%"
            mb={spacing.smallPlus}
            pb={spacing.smallPlus}
          >
            <CategoryName>{category.name}</CategoryName>
            {category.items.map(item => (
              <EducationItem key={item.name}>
                <EducationItemHeaderButton
                  type="button"
                  onClick={() =>
                    setOpenedItem(previousOpenedItem =>
                      previousOpenedItem === item.name ? null : item.name,
                    )
                  }
                >
                  <EducationItemName>{item.name}</EducationItemName>
                  <Spacing horizontal={3} />
                  <RotatableChevron
                    color={palette.darkGrey}
                    rotated={openedItem === item.name}
                  />
                  <Spacing horizontal={3} />
                </EducationItemHeaderButton>
                <Collapse in={openedItem === item.name}>
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
                    {item.helpCenterUrl && (
                      <>
                        <Spacing vertical={4} />
                        <EducationItemLink
                          href={item.helpCenterUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Visit our help center
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
                </Collapse>
              </EducationItem>
            ))}
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
        <FooterLink href="" target="_blank" rel="noreferrer">
          Visit our help center
        </FooterLink>
      </EducationCenterFooter>
    </EducationCenterWrapper>
  );
};

export default EducationCenterSubmenu;

import React from 'react';
import NavigationItem from './NavigationItem';
import { NavigationIconContainer, NavigationIconNewLabel } from './styled';

const IconNavigationItem = ({
  icon: Icon,
  subMenuOpen,
  navSelectedColor,
  isNew,
  ...restProps
}) => {
  return (
    <NavigationItem subMenuOpen={subMenuOpen} {...restProps}>
      {({ isActive }) => (
        <>
          {isNew && <NavigationIconNewLabel>New!</NavigationIconNewLabel>}
          <NavigationIconContainer
            isActive={isActive}
            subMenuOpen={subMenuOpen}
            navSelectedColor={navSelectedColor}
          >
            <Icon />
          </NavigationIconContainer>
        </>
      )}
    </NavigationItem>
  );
};

export default IconNavigationItem;

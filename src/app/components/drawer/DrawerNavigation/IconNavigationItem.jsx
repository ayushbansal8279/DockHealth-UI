import React from 'react';
import NavigationItem from './NavigationItem';
import { NavigationIconContainer } from './styled';

const IconNavigationItem = ({
  icon: Icon,
  strokeIcon,
  subMenuOpen,
  ...restProps
}) => {
  return (
    <NavigationItem subMenuOpen={subMenuOpen} {...restProps}>
      {({ isActive }) => (
        <NavigationIconContainer
          isActive={isActive}
          strokeIcon={strokeIcon}
          subMenuOpen={subMenuOpen}
        >
          <Icon />
        </NavigationIconContainer>
      )}
    </NavigationItem>
  );
};

export default IconNavigationItem;

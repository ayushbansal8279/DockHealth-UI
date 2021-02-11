import React from 'react';
import NavigationItem from './NavigationItem';
import { NavigationIconContainer } from './styled';

const IconNavigationItem = ({ icon: Icon, subMenuOpen, ...restProps }) => {
  return (
    <NavigationItem subMenuOpen={subMenuOpen} {...restProps}>
      {({ isActive }) => (
        <NavigationIconContainer isActive={isActive} subMenuOpen={subMenuOpen}>
          <Icon />
        </NavigationIconContainer>
      )}
    </NavigationItem>
  );
};

export default IconNavigationItem;

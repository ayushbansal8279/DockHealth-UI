import Tooltip from 'components/common/Tooltip/Tooltip';
import React, { useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { NavigationButton } from './styled';

const NavigationItem = ({
  children,
  name,
  subMenuKey,
  path,
  subMenuOpen,
  onItemClick,
}) => {
  const routeIsMatching = useRouteMatch(path);
  const isActive = path !== undefined && routeIsMatching;

  const defaultPath = Array.isArray(path) ? path[0] : path;

  const handleClick = useCallback(() => {
    onItemClick(subMenuKey, defaultPath);
  }, [subMenuKey, defaultPath, onItemClick]);

  return (
    <Tooltip title={name} placement="right" hideTooltip={subMenuOpen}>
      <NavigationButton
        isActive={isActive && !subMenuKey}
        subMenuOpen={subMenuOpen}
        onClick={handleClick}
      >
        {typeof children === 'function' ? children({ isActive }) : children}
      </NavigationButton>
    </Tooltip>
  );
};

export default NavigationItem;

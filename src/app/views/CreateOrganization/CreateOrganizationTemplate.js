import React from 'react';
import { useSmallScreen } from 'helpers/utility-functions';
import DockHeaderLogo from 'img/dock-header-logo.svg';
import { Background, Logo, MainContainer, Navbar } from './styled';

const CreateOrganizationTemplate = ({ children }) => {
  const isSmallScreen = useSmallScreen();

  return (
    <Background>
      <Navbar>
        <a href="/">
          <Logo alt="Dock Health logo" src={DockHeaderLogo} />
        </a>
      </Navbar>
      <MainContainer isSmallScreen={isSmallScreen}>{children}</MainContainer>
    </Background>
  );
};

export default CreateOrganizationTemplate;

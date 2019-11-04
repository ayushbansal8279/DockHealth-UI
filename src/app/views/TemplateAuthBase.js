import Hidden from '@material-ui/core/Hidden';
import { node } from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';

import {
  BackgroundContainer,
  BackgroundModalContainer,
  BackgroundRectangleContainer,
  ContentContainer,
  DockLogo,
  DockLogoContainer,
  MainContentContainer,
  SmallBackgroundRectangleContainer,
} from './TemplateAuthBase.styled';

const MODAL_CONTAINER_RATIO = 1312 / 1128;
const PADDING_CONTAINER_RATIO = 50 / 1312;

const MAX_MODAL_CONTAINER_WIDTH = 984;

class TemplateAuthBase extends Component {
  state = {
    modalContainerWidth: 0,
  };

  rectangleContainerRef = React.createRef();

  componentDidMount = async () => {
    const { router } = this.props;

    window.addEventListener('resize', this.onResize);

    this.removeRouterListener = router.listen(this.onResize);

    // First render does not return the valid offset height of ref element
    // thus the second resizing is invoked here
    await this.onResize();
    await this.onResize();
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onResize);
    this.removeRouterListener();
  };

  onResize = () => {
    const { current } = this.rectangleContainerRef;

    if (current) {
      const modalContainerWidth = Math.floor(
        current.offsetHeight * MODAL_CONTAINER_RATIO,
      );

      this.setState({
        modalContainerWidth,
      });
    } else {
      setImmediate(() => {
        this.onResize();
      });
    }
  };

  render = () => {
    const { children } = this.props;
    const { modalContainerWidth } = this.state;

    const contentContainerPadding = Math.floor(
      modalContainerWidth * PADDING_CONTAINER_RATIO,
    );

    const transformScale = modalContainerWidth / MAX_MODAL_CONTAINER_WIDTH;

    return (
      <BackgroundContainer>
        <BackgroundModalContainer
          container
          style={{
            width: modalContainerWidth,
            transform: `scale(${transformScale})`,
          }}
        >
          <Hidden smDown>
            <BackgroundRectangleContainer ref={this.rectangleContainerRef}>
              <img src="assets/img/svg/login-rectangle.svg" alt="Background" />
            </BackgroundRectangleContainer>
          </Hidden>
          <Hidden mdUp>
            <SmallBackgroundRectangleContainer
              ref={this.rectangleContainerRef}
            />
          </Hidden>
          <ContentContainer
            padding={contentContainerPadding * transformScale}
            container
            item
            sm={12}
            md={6}
            direction="column"
            wrap="nowrap"
          >
            <DockLogoContainer>
              <DockLogo src="assets/img/dock-logo.png" alt="Dock Health" />
            </DockLogoContainer>
            <MainContentContainer>{children}</MainContentContainer>
          </ContentContainer>
        </BackgroundModalContainer>
      </BackgroundContainer>
    );
  };
}

TemplateAuthBase.propTypes = {
  children: node.isRequired,
};

export default withRouter(TemplateAuthBase);

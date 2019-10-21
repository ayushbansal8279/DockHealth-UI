import { Hidden } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { node } from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';

import {
  BackgroundCenterContainer,
  BackgroundContainer,
  BackgroundHorizontalFiller,
  BackgroundModalContainer,
  BackgroundRectangleContainer,
  BackgroundVerticalFiller,
  ContentContainer,
  DockLogo,
  DockLogoContainer,
  MainContentContainer,
  SmallBackgroundRectangleContainer,
} from './TemplateAuthBase.styled';

const MODAL_CONTAINER_RATIO = 1312 / 1128;
const PADDING_CONTAINER_RATIO = 50 / 1312;
const IMAGE_HEIGHT_RATIO = 112 / 1312;

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
    const logoImageHeight = Math.floor(
      modalContainerWidth * IMAGE_HEIGHT_RATIO,
    );

    return (
      <BackgroundContainer>
        <BackgroundHorizontalFiller />
        <BackgroundCenterContainer>
          <BackgroundVerticalFiller />
          <BackgroundModalContainer
            container
            style={{ width: modalContainerWidth }}
          >
            <Hidden smDown>
              <BackgroundRectangleContainer ref={this.rectangleContainerRef}>
                <img
                  src="assets/img/svg/login-rectangle.svg"
                  alt="Background"
                />
              </BackgroundRectangleContainer>
            </Hidden>
            <Hidden mdUp>
              <SmallBackgroundRectangleContainer
                ref={this.rectangleContainerRef}
              />
            </Hidden>
            <ContentContainer
              padding={contentContainerPadding}
              container
              item
              sm={12}
              md={6}
              direction="column"
            >
              <DockLogoContainer
                container
                item
                xs={12}
                justify="flex-start"
                alignItems="flex-end"
              >
                <DockLogo
                  height={logoImageHeight}
                  src="assets/img/dock-logo.png"
                  alt="Dock Health"
                />
              </DockLogoContainer>
              <MainContentContainer item xs={12}>
                {children}
              </MainContentContainer>
            </ContentContainer>
            <Grid item sm={12} md={6}>
              &nbsp;
            </Grid>
          </BackgroundModalContainer>
          <BackgroundVerticalFiller />
        </BackgroundCenterContainer>
        <BackgroundHorizontalFiller />
      </BackgroundContainer>
    );
  };
}

TemplateAuthBase.propTypes = {
  children: node.isRequired,
};

export default withRouter(TemplateAuthBase);

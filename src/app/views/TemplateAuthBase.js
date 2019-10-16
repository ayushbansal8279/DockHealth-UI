import Grid from '@material-ui/core/Grid';
import { node } from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';

import {
  BackgroundCenterContainer,
  BackgroundContainer,
  BackgroundHorizontalFiller,
  BackgroundModalContainer,
  BackgroundVerticalFiller,
  BackgroundRectangleContainer,
} from './TemplateAuthBase.styled';

const MODAL_CONTAINER_RATIO = 1312 / 1128;

class TemplateAuthBase extends Component {
  state = {
    modalContainerWidth: 0,
  };

  rectangleContainerRef = React.createRef();

  componentDidMount = async () => {
    const { router } = this.props;

    window.addEventListener('resize', this.onResize);

    this.removeRouterListener = router.listen(() => {
      this.onResize();
    });

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
      const modalContainerWidth = Math.floor(current.offsetHeight * MODAL_CONTAINER_RATIO);

      this.setState({
        modalContainerWidth,
      });
    }
  };

  render = () => {
    const { children } = this.props;
    const { modalContainerWidth } = this.state;

    return (
      <BackgroundContainer>
        <BackgroundHorizontalFiller />
        <BackgroundCenterContainer>
          <BackgroundVerticalFiller />
          <BackgroundModalContainer container style={{ width: modalContainerWidth }}>
            <BackgroundRectangleContainer ref={this.rectangleContainerRef}>
              <img src="assets/img/svg/login-rectangle.svg" alt="Background" />
            </BackgroundRectangleContainer>
            <Grid container item sm={12} md={6}>
              <Grid container item xs={12} justify="center">
                <img className="dock-logo" src="assets/img/dock-logo.png" alt="Dock Health" />
              </Grid>
              <Grid item xs={12}>
                {children}
              </Grid>
            </Grid>
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

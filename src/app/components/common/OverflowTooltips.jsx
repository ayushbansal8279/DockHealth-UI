import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Popover } from '@material-ui/core';

const checkOverflow = element => element.offsetWidth < element.scrollWidth;

const StyledPopover = styled(props => (
  <Popover {...props} classes={{ paper: 'paper' }} />
))`
  && {
    pointer-events: none;
    font-size: 14px;
    color: #585858;

    .paper {
      padding: 7px 9px;
      margin-left: -9px;
      margin-top: -4px;
    }
  }
`;

class OverflowTooltips extends Component {
  state = {
    anchorEl: null,
    tooltip: '',
  };

  handleOpen = event => {
    const { anchorEl } = this.state;
    const node = event.target;

    if (anchorEl === node) {
      return;
    }

    if (!checkOverflow(node)) {
      this.setState({ anchorEl: null });
      return;
    }

    // if anchor is not first set to null, the popover doesn't update its position
    this.setState({ anchorEl: null, tooltip: '' }, () => {
      this.setState({ anchorEl: node, tooltip: node.textContent });
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { children, className } = this.props;
    const { anchorEl, tooltip } = this.state;

    return (
      /* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */
      <div
        onMouseOver={this.handleOpen}
        onMouseLeave={this.handleClose}
        className={className}
      >
        {children}
        <StyledPopover
          id="mouse-over-popover"
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
          onClose={this.handleClose}
          disableRestoreFocus
        >
          {tooltip}
        </StyledPopover>
      </div>
    );
  }
}

OverflowTooltips.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OverflowTooltips;

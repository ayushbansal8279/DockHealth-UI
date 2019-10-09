import React from 'react';
import BaseComponent from './BaseComponent';

class BaseComponentWithFoundationUpdate extends BaseComponent {
  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
  }
}
export default BaseComponentWithFoundationUpdate;

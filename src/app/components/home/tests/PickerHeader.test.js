import React from 'react';
import { shallow } from 'enzyme';
import PickerHeader from '../PickerHeader';

describe('PickerHeader', () => {
  it('should render correctl', () => {
    const props = {
      handleClose: jest.fn(),
      handleSearchToggle: jest.fn(),
      children: 'Title',
      closeLabel: 'Close',
    };
    const wrapper = shallow(<PickerHeader {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});

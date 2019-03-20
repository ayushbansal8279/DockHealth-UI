import React from 'react';
import { shallow } from 'enzyme';
import SearchHeader from '../SearchHeader';

describe('SearchHeader', () => {
  it('should render correctly', () => {
    const props = {
      handleSearch: jest.fn(),
      handleSearchToggle: jest.fn(),
    };
    const wrapper = shallow(<SearchHeader {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});

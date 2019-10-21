import React from 'react';
import { shallow } from 'enzyme';
import Creator from '../Creator';

describe('Creator', () => {
  it('should render correctly', () => {
    const props = {
      initials: 'JS',
      userName: 'John Smith',
      isOwn: false,
    };
    const wrapper = shallow(<Creator {...props}>This is some content.</Creator>);
    expect(wrapper).toMatchSnapshot();
  });
});

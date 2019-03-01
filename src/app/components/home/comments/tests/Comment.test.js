import React from 'react';
import { shallow } from 'enzyme';
import Comment from '../Comment';

describe('Comment', () => {
  it('should render correctly', () => {
    const props = {
      isOwn: false,
    };
    const wrapper = shallow(<Comment {...props}>Lorem ipsum dolor...</Comment>);
    expect(wrapper).toMatchSnapshot();
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import Day from '../Day';

describe('Day', () => {
  it('should render correctly', () => {
    const props = {
      date: moment('20120620'),
    };
    const wrapper = shallow(<Day {...props}>Lorem ipsum dolor...</Day>);
    expect(wrapper).toMatchSnapshot();
  });
});

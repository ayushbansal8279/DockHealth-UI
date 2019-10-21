import { mount, shallow } from 'enzyme';
import React from 'react';

import AddTask from '../AddTask';

describe('SubmitComment', () => {
  it('should render correctly', () => {
    const props = {
      submit: jest.fn(),
    };
    const wrapper = shallow(<AddTask {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should submit text', () => {
    const props = {
      submit: jest.fn(),
    };

    const wrapper = mount(<AddTask {...props} />);

    const value = 'A new task.';
    wrapper.find('input').simulate('change', { target: { value } });
    wrapper.find('form').simulate('submit');
    expect(props.submit).toBeCalledWith(value);
  });

  it('should submit text on button press', () => {
    const props = {
      submit: jest.fn(),
    };

    const wrapper = mount(<AddTask {...props} />);

    const value = 'A new task.';
    wrapper.find('input').simulate('change', { target: { value } });
    wrapper.find('button').simulate('click');
    expect(props.submit).toBeCalledWith(value);
  });
});

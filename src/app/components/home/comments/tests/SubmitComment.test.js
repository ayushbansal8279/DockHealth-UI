import React from 'react';
import { shallow, mount } from 'enzyme';
import SubmitComment from '../SubmitComment';

describe('SubmitComment', () => {
  it('should render correctly', () => {
    const props = {
      submit: jest.fn(),
    };
    const wrapper = shallow(<SubmitComment {...props}>This is some content.</SubmitComment>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should submit text', () => {
    const props = {
      submit: jest.fn(),
    };

    const wrapper = mount(<SubmitComment {...props}>This is some content.</SubmitComment>);

    const value = 'A new comment.';
    wrapper.find('input').simulate('change', { target: { value } });
    wrapper.find('form').simulate('submit');
    expect(props.submit).toBeCalledWith(value);
  });

  it('should submit text on button press', () => {
    const props = {
      submit: jest.fn(),
    };

    const wrapper = mount(<SubmitComment {...props}>This is some content.</SubmitComment>);

    const value = 'A new comment.';
    wrapper.find('input').simulate('change', { target: { value } });
    wrapper.find('button').simulate('click');
    expect(props.submit).toBeCalledWith(value);
  });
});

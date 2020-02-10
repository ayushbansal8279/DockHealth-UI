import React from 'react';
import { shallow } from 'enzyme';
import { Comments } from '../Comments';

describe('Comments', () => {
  it('should render correctly', () => {
    const props = {
      submit: jest.fn(),
      userIdentifier: 0,
      comments: [
        {
          commentIdentifier: 0,
          comment: 'Lipsum',
          dateCreated: '20120620',
          creator: {
            userIdentifier: 142,
            userName: 'John Smith',
            initials: 'JS',
          },
        },
      ],
    };
    const wrapper = shallow(<Comments {...props}>Lorem ipsum dolor...</Comments>);
    expect(wrapper).toMatchSnapshot();
  });
});

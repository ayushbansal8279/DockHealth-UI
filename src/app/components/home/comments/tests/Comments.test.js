import React from 'react';
import { shallow } from 'enzyme';
import { Comments } from '../Comments';

describe('Comments', () => {
  it('should render correctly', () => {
    const props = {
      submit: jest.fn(),
      userId: 0,
      comments: [
        {
          commentId: 0,
          comment: 'Lipsum',
          dateCreated: '20120620',
          creator: {
            userId: 142,
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

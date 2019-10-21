import React from 'react';
import { shallow, mount } from 'enzyme';
import moment from 'moment';
import { History, generateFormat } from '../History';

describe('generateFormat', () => {
  it('should correctly show current single-digit time', () => {
    const createdDateTime = moment().hour(6);
    expect(generateFormat(createdDateTime)).toMatchSnapshot();
  });
  it('should correctly show current double-digit time', () => {
    const createdDateTime = moment().hour(12);
    expect(generateFormat(createdDateTime)).toMatchSnapshot();
  });
  it('should show past months', () => {
    const createdDateTime = moment().subtract(1, 'days').hour(6);
    expect(generateFormat(createdDateTime)).toMatchSnapshot();
  });
  it('should show past years', () => {
    const createdDateTime = moment().subtract(1, 'years').hour(6);
    expect(generateFormat(createdDateTime)).toMatchSnapshot();
  });
});

describe('History', () => {
  const baseProps = {
    taskId: 0,
    fetchHistory: jest.fn(),
    clearHistory: jest.fn(),
    isLoading: false,
  };
  it('should render correctly when collapsed', () => {
    const wrapper = shallow(<History {...baseProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should show loading', () => {
    const props = { ...baseProps, isLoading: true };
    const wrapper = shallow(<History {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should clear history on mount', () => {
    mount(<History {...baseProps} />);
    expect(baseProps.clearHistory).toBeCalled();
  });
  it('should fetch history on click', () => {
    const wrapper = mount(<History {...baseProps} />);
    wrapper.find('button').simulate('click');
    expect(baseProps.fetchHistory).toBeCalled();
  });
  it('should render history', () => {
    const props = {
      ...baseProps,
      history: [{
        auditId: 0,
        auditEventTypeDescription: 'Description',
        createdDateTime: '2019-02-20T15:08:09.000+0000',
        user: { userId: 0, userName: 'John Smith' },
      },
      {
        auditId: 1,
        auditEventTypeDescription: 'Another description',
        createdDateTime: '2019-01-20T15:08:09.000+0000',
        user: { userId: 1, userName: 'Jane Doe' },
      },
      ],
    };
    const wrapper = shallow(<History {...props} />);
    wrapper.find('HistoryToggle').simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
  it('should collapse history on second click', () => {
    const props = {
      ...baseProps,
      history: [{
        auditId: 0,
        auditEventTypeDescription: 'Description',
        createdDateTime: '2019-02-20T15:08:09.000+0000',
        user: { userId: 0, userName: 'John Smith' },
      },
      {
        auditId: 1,
        auditEventTypeDescription: 'Another description',
        createdDateTime: '2019-01-20T15:08:09.000+0000',
        user: { userId: 1, userName: 'Jane Doe' },
      },
      ],
    };
    const wrapper = shallow(<History {...props} />);
    wrapper.find('HistoryToggle').simulate('click');
    wrapper.find('HistoryToggle').simulate('click');
    expect(baseProps.clearHistory).toBeCalled();
    expect(wrapper).toMatchSnapshot();
  });
});

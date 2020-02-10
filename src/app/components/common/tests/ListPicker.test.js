import React from 'react';
import { shallow } from 'enzyme';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { ListPicker, StyledPopover } from '../ListPicker';

describe('ListPicker', () => {
  it('should render correctly', () => {
    const props = {
      assign: jest.fn(),
      item: { listName: 'List #1' },
      task: {},
    };
    const wrapper = shallow(<ListPicker {...props} />);

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find(StyledPopover).prop('open')).toBe(false);
    expect(wrapper.find(Dialog).prop('open')).toBe(false);
  });

  it('should render popover after click', () => {
    const props = {
      assign: jest.fn(),
      item: { taskListIdentifier: 0, listName: 'List #1', creator: { userName: 'JS' } },
      items: [
        { taskListIdentifier: 0, listName: 'List #1', creator: { userName: 'JS' } },
        { taskListIdentifier: 1, listName: 'List #2', creator: { userName: 'JS' } },
      ],
      task: {},
    };
    const wrapper = shallow(<ListPicker {...props} />);
    wrapper.find('ToggleButton').simulate('click', { stopPropagation: jest.fn(), currentTarget: {} });

    expect(wrapper.find(StyledPopover).prop('open')).toBe(true);
    expect(wrapper.find(Dialog).prop('open')).toBe(false);
    expect(props.assign).not.toBeCalled();
  });

  it('should show confirmation after clicking on an item', () => {
    const props = {
      assign: jest.fn(),
      item: { taskListIdentifier: 0, listName: 'List #1', creator: { userName: 'JS' } },
      items: [
        { taskListIdentifier: 0, listName: 'List #1', creator: { userName: 'JS' } },
        { taskListIdentifier: 1, listName: 'List #2', creator: { userName: 'JS' } },
      ],
      task: {},
    };
    const wrapper = shallow(<ListPicker {...props} />);
    wrapper.find('ToggleButton').simulate('click', { stopPropagation: jest.fn(), currentTarget: {} });
    wrapper.find('ListItem').first().simulate('click', { currentTarget: { id: 1 } });

    expect(wrapper.find(Dialog).prop('open')).toBe(true);
    expect(props.assign).not.toBeCalled();
  });

  it('should assign after confirmation', () => {
    const props = {
      assign: jest.fn(),
      item: { taskListIdentifier: 0, listName: 'List #1', creator: { userName: 'JS' } },
      items: [
        { taskListIdentifier: 0, listName: 'List #1', creator: { userName: 'JS' } },
        { taskListIdentifier: 1, listName: 'List #2', creator: { userName: 'JS' } },
      ],
      task: {},
    };
    const wrapper = shallow(<ListPicker {...props} />);
    wrapper.find('ToggleButton').simulate('click', { stopPropagation: jest.fn(), currentTarget: {} });
    wrapper.find('ListItem').first().simulate('click', { currentTarget: { id: '1' } });
    wrapper.find(Button).find('[children="Move"]').simulate('click');

    expect(props.assign).toBeCalledWith(props.items[1]);
  });
});

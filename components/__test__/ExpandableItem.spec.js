import {mount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest';
import ExpandableItem from '../ExpandableItem.vue';

describe('ExpandableItem.vue', () => {
  it('renders the item with the correct title', () => {
    const wrapper = mount(ExpandableItem, {props: {title: 'More Info'}});
    expect(wrapper.text()).toContain('More Info');
  }); 

    it('expands when header is clicked', async () => {
    const wrapper = mount(ExpandableItem, {props: {title: 'More Info'}});
    expect(wrapper.find(".item-content").exists()).toBe(false);
    await wrapper.find(".item-header").trigger('click');
    expect(wrapper.find(".item-content").exists()).toBe(true);
    });

    it('collapses when header is clicked twice', async () => {
    const wrapper = mount(ExpandableItem, { props: { title: 'More Info' } });
    await wrapper.find('.item-header').trigger('click');
    expect(wrapper.find('.item-content').exists()).toBe(true);
    await wrapper.find('.item-header').trigger('click');
    expect(wrapper.find('.item-content').exists()).toBe(false);
  });

  it('shows "+" icon when collapsed and "-" when expanded', async () => {
    const wrapper = mount(ExpandableItem, { props: { title: 'More Info' } });
    expect(wrapper.find('.icon').text()).toBe('+');
    await wrapper.find('.item-header').trigger('click');
    expect(wrapper.find('.icon').text()).toBe('-');
  });

  it('renders slot content when expanded', async () => {
    const wrapper = mount(ExpandableItem, {
      props: { title: 'More Info' },
      slots: { default: '<div class="slot-content">Hello World</div>' }
    });
    await wrapper.find('.item-header').trigger('click');
    expect(wrapper.find('.slot-content').exists()).toBe(true);
    expect(wrapper.find('.slot-content').text()).toBe('Hello World');
  });
});
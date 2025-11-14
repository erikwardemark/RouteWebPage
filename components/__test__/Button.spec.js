import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Button from '../Button.vue';

describe('Button.vue', () => {
  it('renders the button with the correct label', () => {
    const wrapper = mount(Button, { props: { label: 'Click Me' } });
    expect(wrapper.text()).toBe('Click Me');
  });

  it('emits a click event when clicked', async () => {
    const wrapper = mount(Button, { props: { label: 'Click Me' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  }); 
});  
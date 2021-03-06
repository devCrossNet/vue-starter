import { mount, createLocalVue } from '@vue/test-utils';
import VueCollapse from './VueCollapse.vue';

const localVue = createLocalVue();

describe('VueCollapse.vue', () => {
  test('renders component', async () => {
    const wrapper = mount(VueCollapse, {
      localVue,
      slots: {
        default: '<h1>content</h1>',
      },
    });

    expect(wrapper.find('h1').text()).toBe('content');

    await wrapper.setProps({ show: false });

    expect(wrapper.props().show).toBe(false);
  });
});

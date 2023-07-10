import { shallowMount } from '@vue/test-utils'
import HelloTsx from './HelloTsx'

describe('HelloTsx.tsx', () => {
  it('text content should render', async () => {
    const wrapper = shallowMount(HelloTsx)
    expect(wrapper.text()).toMatch('tsx text 11')
    await wrapper.trigger('click')
    expect(wrapper.text()).toMatch('tsx text clicked')
  })
})

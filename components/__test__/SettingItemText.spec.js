import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import SettingItemText from '../SettingItemText.vue'

describe('SettingItemText.vue', () => {
    it('renders the setting item with the correct title', () => {
        const wrapper = mount (SettingItemText, {props: {title: 'Test', description: 'This is a test description.'}})
        expect(wrapper.props('title')).toBe('Test')
        expect(wrapper.props('description')).toBe('This is a test description.')
    })
    
    it('emits an input event when text is entered', async () => {
        const wrapper = mount(SettingItemText, {props: {title: 'Test', description: 'This is a test description.'}})
        const input = wrapper.find('input')
        await input.setValue('New Value')
        expect(wrapper.emitted()).toHaveProperty('updateCurrentSetting')
        expect(wrapper.emitted().updateCurrentSetting[0]).toEqual(['New Value'])
    })
})
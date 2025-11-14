import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import MapItem from '../MapItem.vue';

// Mock vue3-google-map components
const GoogleMapStub = {
  template: '<div><slot /></div>',
}
const PolylineStub = {
  template: '<div></div>',
  props: ['options'],
}

describe('MapItem.vue', () => {
  it('renders Polyline with correct pathOptions', () => {
    const pathOptions = {
      path: [{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }],
      color: 'blue',
      weight: 4,
    }
    const wrapper = mount(MapItem, {
      props: {
        center: { lat: 5, lng: 3 },
        pathOptions,
      },
      global: {
        stubs: {
          GoogleMap: GoogleMapStub,
          Polyline: PolylineStub,
        },
      },
    })
    const polyline = wrapper.findComponent(PolylineStub)
    expect(polyline.exists()).toBe(true)
    expect(polyline.props('options')).toEqual(pathOptions)
  })

  it('removes vertex on Polyline dblclick', async () => {
    // Mock getPath and removeAt
    const removeAt = vi.fn()
    const mockPath = { removeAt }
    const mockPolyline = { getPath: () => mockPath }
    const wrapper = mount(MapItem, {
      props: {
        center: { lat: 5, lng: 3 },
        pathOptions: {
          path: [{ lat: 1, lng: 2 }, { lat: 3, lng: 4 }],
        },
      },
      global: {
        stubs: {
          GoogleMap: GoogleMapStub,
          Polyline: PolylineStub,
        },
      },
    })
    // Set polylineref mock
    wrapper.vm.polylineref = { polyline: mockPolyline }
    // Simulate dblclick event
    await wrapper.vm.onPolylineDblClick({ vertex: 1 })
    expect(removeAt).toHaveBeenCalledWith(1)
  })

  it('getNewPath returns polyline path', () => {
    const mockPath = { removeAt: vi.fn() }
    const mockPolyline = { getPath: () => mockPath }
    const wrapper = mount(MapItem, {
      props: {
        center: { lat: 5, lng: 3 },
        pathOptions: {
          path: [{ lat: 1, lng: 2 }],
        },
      },
      global: {
        stubs: {
          GoogleMap: GoogleMapStub,
          Polyline: PolylineStub,
        },
      },
    })
    wrapper.vm.polylineref = { polyline: mockPolyline }
    const result = wrapper.vm.getNewPath()
    expect(result).toBe(mockPath)
  })
})
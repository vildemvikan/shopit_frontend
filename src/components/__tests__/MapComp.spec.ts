import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MapComponent from '../Map/MapComp.vue'

const mapMock = {
  addTo: vi.fn().mockReturnThis(),
}

const tileLayerMock = {
  addTo: vi.fn().mockReturnThis(),
}

const markerMock = {
  addTo: vi.fn().mockReturnThis(),
}

// Mock leaflet
vi.mock('leaflet', () => {
  return {
    default: {
      map: vi.fn(() => mapMock),
      tileLayer: vi.fn(() => tileLayerMock),
      marker: vi.fn(() => markerMock),
    }
  }
})

describe('MapComponent', () => {
  let L: any

  beforeEach(() => {
    // Get fresh instance of our mocked module
    vi.resetModules()
    L = require('leaflet').default

    // Reset all mock function calls
    vi.clearAllMocks()
  })

  it('renders the component', () => {
    const wrapper = mount(MapComponent, {
      props: {
        lat: '51.505',
        lng: '-0.09'
      }
    })

    expect(wrapper.find('.map-container').exists()).toBe(true)
  })
})

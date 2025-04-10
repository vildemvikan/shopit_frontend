import { describe, it, expect } from 'vitest'
import useEventsBus from '../../../utils/EventBus'

describe('EventBus', () => {
  it('should create a new event bus', () => {
    const { bus, emit } = useEventsBus()

    expect(bus.value).toBeInstanceOf(Map)
    expect(typeof emit).toBe('function')
  })

  it('should emit events and store them in the bus', () => {
    const { bus, emit } = useEventsBus()

    emit('testEvent', 'value1')
    expect(bus.value.has('testEvent')).toBe(true)
    expect(bus.value.get('testEvent')).toEqual(['value1'])

    emit('multiArg', 'arg1', 'arg2', { key: 'value' })
    expect(bus.value.get('multiArg')).toEqual(['arg1', 'arg2', { key: 'value' }])

    emit('testEvent', 'newValue')
    expect(bus.value.get('testEvent')).toEqual(['newValue'])
  })

  it('should allow multiple components to access the same bus', () => {
    const instance1 = useEventsBus()
    const instance2 = useEventsBus()

    instance1.emit('sharedEvent', 'sharedData')

    expect(instance2.bus.value.get('sharedEvent')).toEqual(['sharedData'])

    instance2.emit('anotherEvent', 'moreData')

    expect(instance1.bus.value.get('anotherEvent')).toEqual(['moreData'])
  })
})

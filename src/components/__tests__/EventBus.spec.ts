// EventBus.test.ts
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

    // Emit a simple event
    emit('testEvent', 'value1')
    expect(bus.value.has('testEvent')).toBe(true)
    expect(bus.value.get('testEvent')).toEqual(['value1'])

    // Emit an event with multiple arguments
    emit('multiArg', 'arg1', 'arg2', { key: 'value' })
    expect(bus.value.get('multiArg')).toEqual(['arg1', 'arg2', { key: 'value' }])

    // Override existing event
    emit('testEvent', 'newValue')
    expect(bus.value.get('testEvent')).toEqual(['newValue'])
  })

  it('should allow multiple components to access the same bus', () => {
    // Create two instances
    const instance1 = useEventsBus()
    const instance2 = useEventsBus()

    // Emit event from first instance
    instance1.emit('sharedEvent', 'sharedData')

    // Check if second instance can see it
    expect(instance2.bus.value.get('sharedEvent')).toEqual(['sharedData'])

    // Emit from second instance
    instance2.emit('anotherEvent', 'moreData')

    // Check if first instance can see it
    expect(instance1.bus.value.get('anotherEvent')).toEqual(['moreData'])
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
	beforeEach(() => vi.useFakeTimers())
	afterEach(() => vi.useRealTimers())

	it('mantém o valor inicial antes do delay e atualiza depois', () => {
		const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 300), { initialProps: { v: 'a' } })
		expect(result.current).toBe('a')

		rerender({ v: 'b' })
		expect(result.current).toBe('a') // ainda dentro do delay

		act(() => vi.advanceTimersByTime(300))
		expect(result.current).toBe('b')
	})

	it('reinicia o timer a cada mudança (debounce de verdade)', () => {
		const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 300), { initialProps: { v: 'a' } })
		rerender({ v: 'b' })
		act(() => vi.advanceTimersByTime(200))
		rerender({ v: 'c' }) // reinicia o timer
		act(() => vi.advanceTimersByTime(200)) // 400ms totais, mas só 200 após 'c'
		expect(result.current).toBe('a')

		act(() => vi.advanceTimersByTime(100)) // completa 300ms após 'c'
		expect(result.current).toBe('c')
	})
})

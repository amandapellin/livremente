// Setup global dos testes: matchers do jest-dom (toBeInTheDocument, etc.) e
// limpeza do DOM entre testes.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
	cleanup()
})

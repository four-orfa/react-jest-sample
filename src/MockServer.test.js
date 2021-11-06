import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import MockServer from './MockServer'

const server = setupServer(
  rest.get('https://jsonplaceholder.typicode.com/users/1', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ username: 'Dummy name' }))
  }),
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => server.close())

describe('Mocking API', () => {
  it('Fetch success Should display fetched data correctly and button disabled', async () => {
    render(<MockServer />)
    userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).not.toHaveAttribute('disabled')
    expect(await screen.findByText('Dummy name')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('disabled')
  })
  it('Fetch failure Should display error message, no render h3 and enable button', async () => {
    server.use(
      rest.get('https://jsonplaceholder.typicode.com/users/1', (req, res, ctx) => {
        return res(ctx.status(404))
      }),
    )
    render(<MockServer />)
    userEvent.click(screen.getByRole('button'))
    expect(await screen.findByTestId('error')).toHaveTextContent('Fetching Failed')
    expect(screen.queryByRole('heading')).toBeNull()
    expect(screen.getByRole('button')).not.toHaveAttribute('disabled')
  })
})

import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import customCounterReducer from './features/customCounter/customCounterSlice'
import ReduxAsync from './ReduxAsync'

import { rest } from 'msw'
import { setupServer } from 'msw/node'

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => server.close)

const server = setupServer(
  rest.get('https://jsonplaceholder.typicode.com/users/1', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ username: 'Dummy name' }))
  }),
)

describe('Redux Async API Mocking', () => {
  let store
  beforeEach(() => {
    jest.useFakeTimers()
    store = configureStore({
      reducer: {
        customCounter: customCounterReducer,
      },
    })
  })

  it('Fetch success Should display username in h1 tag', async () => {
    render(
      <Provider store={store}>
        <ReduxAsync />
      </Provider>,
    )
    expect(screen.queryByRole('heading')).toBeNull()
    userEvent.click(screen.getByText('fetchJSON'))
    expect(await screen.findByText('Dummy name')).toBeInTheDocument()
  })
  it('Fetch failed Should display anonymous in h1 tag', async () => {
    server.use(
      rest.get('https://jsonplaceholder.typicode.com/users/1', (req, res, ctx) => {
        return res(ctx.status(404))
      }),
    )
    render(
      <Provider store={store}>
        <ReduxAsync />
      </Provider>,
    )
    expect(screen.queryByRole('heading')).toBeNull()
    userEvent.click(screen.getByText('fetchJSON'))
    expect(await screen.findByText('anonymous')).toBeInTheDocument()
  })
})

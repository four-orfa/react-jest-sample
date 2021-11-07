import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import customCounterReducer from './features/customCounter/customCounterSlice'
import ReduxAsync from './ReduxAsync'
import { act } from 'react-dom/test-utils'

afterEach(() => {
  cleanup()
})

describe('ReduxAsync Test', () => {
  let store
  beforeEach(() => {
    jest.useFakeTimers()
    store = configureStore({
      reducer: {
        customCounter: customCounterReducer,
      },
    })
  })

  it('Should display value with 100 + payload', async () => {
    render(
      <Provider store={store}>
        <ReduxAsync />
      </Provider>,
    )
    expect(await screen.findByTestId('count-value')).not.toHaveTextContent('105')
    userEvent.click(screen.getByText('Fetch Dummy'))
    expect(await screen.findByTestId('count-value')).not.toHaveTextContent('105')
    jest.advanceTimersByTime(6000)
    expect(await screen.findByTestId('count-value')).toHaveTextContent('105')
  })
})

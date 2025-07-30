import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { ConfigProvider } from 'antd'

const antdConfig = {
  theme: {
    token: {
    },
  },
}

const AllTheProviders = ({ children, mocks = [] }: {
  children: React.ReactNode
  mocks?: MockedResponse[] | undefined
}) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <ConfigProvider {...antdConfig}>
        {children}
      </ConfigProvider>
    </MockedProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { mocks?: MockedResponse[] }
) => {
  const { mocks, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders mocks={mocks}>{children}</AllTheProviders>,
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }

import '@testing-library/jest-dom'
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  useParams() {
    return {}
  },
  usePathname() {
    return ''
  },
}))

jest.mock('@apollo/client', () => {
  const actualApollo = jest.requireActual('@apollo/client')

  return {
    ...actualApollo,
    useQuery: jest.fn(() => ({
      data: undefined,
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    })),
    useMutation: jest.fn(() => [
      jest.fn(),
      {
        data: undefined,
        loading: false,
        error: undefined,
      },
    ]),
    ApolloClient: jest.fn().mockImplementation(() => ({
      query: jest.fn(),
      mutate: jest.fn(),
      subscribe: jest.fn(),
      readQuery: jest.fn(),
      writeQuery: jest.fn(),
      cache: {
        reset: jest.fn(),
      },
    })),
    InMemoryCache: jest.fn().mockImplementation(() => ({})),
    ApolloProvider: ({ children }) => children,
  }
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: jest.fn().mockReturnValue(''),
  }),
})

global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() { }
  unobserve() { }
  disconnect() { }
}

HTMLElement.prototype.scrollIntoView = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

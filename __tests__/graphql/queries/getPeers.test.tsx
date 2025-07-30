import { ApolloServer } from '@apollo/server'
import { gql } from 'graphql-tag'

function makeEmployee(overrides = {}) {
  return {
    id: 'emp1',
    name: 'Employee 1',
    email: 'emp1@test.com',
    picture: null,
    managerId: null,
    companyId: 'company1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    company: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

interface MockPrismaClient {
  company: {
    findUnique: jest.Mock
    create: jest.Mock
  }
  employee: {
    findUnique: jest.Mock
    create: jest.Mock
    update: jest.Mock
    findMany: jest.Mock
    delete: jest.Mock
  }
}

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    company: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

import { typeDefs } from '../../../lib/graphql/schema'
import { resolvers } from '../../../lib/graphql/resolvers'
import { prisma } from '../../../lib/prisma'

const mockPrisma = prisma as unknown as MockPrismaClient


describe('Employee Relations Query Integration', () => {
  let server: ApolloServer

  beforeAll(async () => {
    server = new ApolloServer({
      typeDefs,
      resolvers,
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should list direct subordinates', async () => {
    const employee = makeEmployee({
      id: 'emp1',
      name: 'Manager'
    })

    const subordinates = [
      makeEmployee({ id: 'sub1', name: 'Sub 1', managerId: 'emp1' }),
      makeEmployee({ id: 'sub2', name: 'Sub 2', managerId: 'emp1' })
    ]

    mockPrisma.employee.findUnique.mockResolvedValue(employee)
    mockPrisma.employee.findMany.mockResolvedValue(subordinates)

    const GET_EMPLOYEE_WITH_SUBORDINATES = gql`
      query GetEmployeeWithSubordinates($id: ID!) {
        employee(id: $id) {
          id
          name
          subordinates {
            id
            name
            email
          }
        }
      }
    `

    const response = await server.executeOperation({
      query: GET_EMPLOYEE_WITH_SUBORDINATES,
      variables: { id: 'emp1' }
    })

    expect(response.body.kind).toBe('single')
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined()
      const data = response.body.singleResult.data as {
        employee: { subordinates: Array<{ name: string }> }
      } | null | undefined
      expect(data?.employee.subordinates).toHaveLength(2)
      expect(data?.employee.subordinates[0].name).toBe('Sub 1')
    }
  })

  it('should list second level subordinates', async () => {
    const employee = makeEmployee({
      id: 'emp1',
      name: 'Top Manager'
    })

    const firstLevelSubordinates = [
      makeEmployee({ id: 'sub1', name: 'Sub Level 1', managerId: 'emp1' })
    ]

    const secondLevelSubordinates = [
      makeEmployee({ id: 'sub2', name: 'Sub Level 2 - 1', managerId: 'sub1' }),
      makeEmployee({ id: 'sub3', name: 'Sub Level 2 - 2', managerId: 'sub1' })
    ]

    mockPrisma.employee.findUnique.mockResolvedValue(employee)
    mockPrisma.employee.findMany
      .mockResolvedValueOnce(firstLevelSubordinates)
      .mockResolvedValueOnce(secondLevelSubordinates)

    const GET_EMPLOYEE_WITH_SECOND_LEVEL = gql`
      query GetEmployeeWithSecondLevel($id: ID!) {
        employee(id: $id) {
          id
          name
          secondLevelSubordinates {
            id
            name
            email
          }
        }
      }
    `

    const response = await server.executeOperation({
      query: GET_EMPLOYEE_WITH_SECOND_LEVEL,
      variables: { id: 'emp1' }
    })

    expect(response.body.kind).toBe('single')
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined()
      const data = response.body.singleResult.data as {
        employee: { secondLevelSubordinates: Array<{ name: string }> }
      } | null | undefined
      expect(data?.employee.secondLevelSubordinates).toHaveLength(2)
      expect(data?.employee.secondLevelSubordinates[0].name).toBe('Sub Level 2 - 1')
    }
  })

  it('should list employee peers', async () => {
    const employee = makeEmployee({
      id: 'emp1',
      name: 'Employee',
      managerId: 'manager1'
    })

    const peers = [
      makeEmployee({ id: 'peer1', name: 'Peer 1', managerId: 'manager1' }),
      makeEmployee({ id: 'peer2', name: 'Peer 2', managerId: 'manager1' })
    ]

    mockPrisma.employee.findUnique.mockResolvedValue(employee)
    mockPrisma.employee.findMany.mockReset()
    mockPrisma.employee.findMany.mockResolvedValue(peers)

    const GET_EMPLOYEE_WITH_PEERS = gql`
      query GetEmployeeWithPeers($id: ID!) {
        employee(id: $id) {
          id
          name
          peers {
            id
            name
            email
          }
        }
      }
    `

    const response = await server.executeOperation({
      query: GET_EMPLOYEE_WITH_PEERS,
      variables: { id: 'emp1' }
    })

    expect(response.body.kind).toBe('single')
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined()
      const data = response.body.singleResult.data as {
        employee: { peers: Array<{ name: string }> }
      } | null | undefined
      expect(data?.employee.peers).toHaveLength(2)
      expect(data?.employee.peers[0].name).toBe('Peer 1')
    }
  })
})

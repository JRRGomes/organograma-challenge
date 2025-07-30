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

function makeCompany(overrides = {}) {
  return {
    id: 'company1',
    name: 'Test Company',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

jest.mock('../../lib/prisma', () => ({
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

jest.mock('../../lib/prisma', () => ({
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

import { typeDefs } from '../../lib/graphql/schema'
import { resolvers } from '../../lib/graphql/resolvers'
import { prisma } from '../../lib/prisma'

const mockPrisma = prisma as unknown as MockPrismaClient

describe('Employee Management GraphQL Integration', () => {
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

  it('should create employee successfully', async () => {
    mockPrisma.company.findUnique.mockResolvedValue(makeCompany())
    mockPrisma.employee.create.mockResolvedValue(makeEmployee())

    const CREATE_EMPLOYEE = gql`
      mutation CreateEmployee($input: CreateEmployeeInput!) {
        createEmployee(input: $input) {
          id
          name
          email
        }
      }
    `

    const response = await server.executeOperation({
      query: CREATE_EMPLOYEE,
      variables: {
        input: {
          name: 'João Silva',
          email: 'joao@test.com',
          companyId: 'company1',
        },
      },
    })

    expect(response.body.kind).toBe('single')
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined()
      expect(response.body.singleResult.data).toEqual({
        createEmployee: {
          id: 'emp1',
          name: 'Employee 1',
          email: 'emp1@test.com',
        },
      })
    }
  })

  it('should prevent hierarchy loops', async () => {
    const emp1 = makeEmployee({ id: 'emp1', managerId: null })
    const emp2 = makeEmployee({ id: 'emp2', managerId: 'emp1', name: 'Employee 2', email: 'emp2@test.com' })

    mockPrisma.employee.findUnique
      .mockResolvedValueOnce(emp1)
      .mockResolvedValueOnce(emp2)
      .mockResolvedValueOnce(emp2)
      .mockResolvedValueOnce(emp1)

    const ASSIGN_MANAGER = gql`
      mutation AssignManager($input: AssignManagerInput!) {
        assignManager(input: $input) {
          id
          manager {
            id
          }
        }
      }
    `

    const response = await server.executeOperation({
      query: ASSIGN_MANAGER,
      variables: {
        input: {
          employeeId: 'emp1',
          managerId: 'emp2',
        },
      },
    })

    expect(response.body.kind).toBe('single')
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeDefined()
      expect(response.body.singleResult.errors?.[0].message).toContain('loop')
    }
  })

  it('should list employees by company', async () => {
    const mockEmployees = [
      makeEmployee(),
      makeEmployee({ id: 'emp2', name: 'Maria Santos', email: 'maria@test.com', managerId: 'emp1' }),
    ]

    mockPrisma.employee.findMany.mockResolvedValue(mockEmployees)

    const GET_EMPLOYEES = gql`
      query GetEmployees($companyId: ID!) {
        employees(companyId: $companyId) {
          id
          name
          email
        }
      }
    `

    const response = await server.executeOperation({
      query: GET_EMPLOYEES,
      variables: {
        companyId: 'company1',
      },
    })

    expect(response.body.kind).toBe('single')
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined()
      expect(response.body.singleResult.data).toEqual({
        employees: [
          {
            id: 'emp1',
            name: 'Employee 1',
            email: 'emp1@test.com',
          },
          {
            id: 'emp2',
            name: 'Maria Santos',
            email: 'maria@test.com',
          },
        ],
      })
    }
  })

  it('should remove manager from employee', async () => {
    const employeeWithManager = {
      ...makeEmployee({
        id: 'emp1',
        managerId: 'emp2'
      }),
      manager: makeEmployee({ id: 'emp2', name: 'Manager' }),
      company: makeCompany(),
      subordinates: []
    };

    mockPrisma.employee.findUnique.mockReset();
    mockPrisma.employee.update.mockReset();

    mockPrisma.employee.findUnique.mockResolvedValue(employeeWithManager);

    mockPrisma.employee.update.mockResolvedValue({
      ...makeEmployee({ id: 'emp1', managerId: null }),
      manager: null,
      company: makeCompany(),
      subordinates: []
    });

    const REMOVE_MANAGER = gql`
    mutation RemoveManager($employeeId: ID!) {
      removeManager(employeeId: $employeeId) {
        id
        manager {
          id
        }
      }
    }
  `;

    const response = await server.executeOperation({
      query: REMOVE_MANAGER,
      variables: { employeeId: 'emp1' }
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data).toEqual({
        removeManager: {
          id: 'emp1',
          manager: null
        }
      });
    }

    expect(mockPrisma.employee.findUnique).toHaveBeenCalledWith({
      where: { id: 'emp1' }
    });
    expect(mockPrisma.employee.update).toHaveBeenCalledWith({
      where: { id: 'emp1' },
      data: { managerId: null },
      include: {
        company: true,
        manager: true,
        subordinates: true
      }
    });
  });

  it('should get single employee by id', async () => {
    const employee = makeEmployee()
    mockPrisma.employee.findUnique.mockResolvedValue(employee)

    const GET_EMPLOYEE = gql`
      query GetEmployee($id: ID!) {
        employee(id: $id) {
          id
          name
          email
        }
      }
    `

    const response = await server.executeOperation({
      query: GET_EMPLOYEE,
      variables: { id: 'emp1' },
    })

    expect(response.body.kind).toBe('single')
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined()
      expect(response.body.singleResult.data).toEqual({
        employee: {
          id: 'emp1',
          name: 'Employee 1',
          email: 'emp1@test.com',
        },
      })
    }
  })

  it('should return null when employee not found', async () => {
    mockPrisma.employee.findUnique.mockReset()
    mockPrisma.employee.findUnique.mockResolvedValue(null)

    const GET_EMPLOYEE = gql`
      query GetEmployee($id: ID!) {
        employee(id: $id) {
          id
          name
          email
        }
      }
    `

    const response = await server.executeOperation({
      query: GET_EMPLOYEE,
      variables: { id: 'non-existent-id' },
    })

    expect(response.body.kind).toBe('single')
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined()
      expect(response.body.singleResult.data).toEqual({
        employee: null,
      })
    }
  })
})

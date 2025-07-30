import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  type Company {
    id: ID!
    name: String!
    employees: [Employee!]!
    employeeCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Employee {
    id: ID!
    name: String!
    email: String!
    picture: String
    company: Company!
    manager: Employee
    subordinates: [Employee!]!
    peers: [Employee!]!
    secondLevelSubordinates: [Employee!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateCompanyInput {
    name: String!
  }

  input CreateEmployeeInput {
    name: String!
    email: String!
    picture: String
    companyId: ID!
  }

  input AssignManagerInput {
    employeeId: ID!
    managerId: ID!
  }

  type Query {
    companies: [Company!]!
    company(id: ID!): Company
    employees(companyId: ID!): [Employee!]!
    employee(id: ID!): Employee
  }

  type Mutation {
    createCompany(input: CreateCompanyInput!): Company!
    deleteCompany(id: ID!): Boolean!
    createEmployee(input: CreateEmployeeInput!): Employee!
    assignManager(input: AssignManagerInput!): Employee!
    removeManager(employeeId: ID!): Employee!
    deleteEmployee(id: ID!): Boolean!
  }
`;

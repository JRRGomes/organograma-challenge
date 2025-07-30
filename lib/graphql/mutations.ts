import { gql } from '@apollo/client';

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      employeeCount
      createdAt
    }
  }
`;

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id)
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      id
      name
      email
      picture
      company {
        id
        name
      }
      manager {
        id
        name
      }
    }
  }
`;

export const ASSIGN_MANAGER = gql`
  mutation AssignManager($input: AssignManagerInput!) {
    assignManager(input: $input) {
      id
      name
      manager {
        id
        name
      }
      subordinates {
        id
        name
      }
    }
  }
`;

export const REMOVE_MANAGER = gql`
  mutation RemoveManager($employeeId: ID!) {
    removeManager(employeeId: $employeeId) {
      id
      name
      manager {
        id
        name
      }
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

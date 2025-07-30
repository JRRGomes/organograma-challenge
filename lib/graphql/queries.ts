import { gql } from '@apollo/client';

export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      employeeCount
      createdAt
    }
  }
`;

export const GET_COMPANY = gql`
  query GetCompany($id: ID!) {
    company(id: $id) {
      id
      name
      employeeCount
      employees {
        id
        name
        email
        picture
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
  }
`;

export const GET_EMPLOYEES = gql`
  query GetEmployees($companyId: ID!) {
    employees(companyId: $companyId) {
      id
      name
      email
      picture
      manager {
        id
        name
      }
      subordinates {
        id
        name
      }
      peers {
        id
        name
      }
      secondLevelSubordinates {
        id
        name
      }
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
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
      subordinates {
        id
        name
      }
      peers {
        id
        name
      }
      secondLevelSubordinates {
        id
        name
      }
    }
  }
`;

import { DateTimeResolver } from 'graphql-scalars';
import { prisma } from '../prisma';
import type {
  CompanyWithEmployees,
  EmployeeWithRelations,
  CreateCompanyMutationArgs,
  CreateEmployeeMutationArgs,
  AssignManagerMutationArgs,
  RemoveManagerMutationArgs,
  DeleteEmployeeMutationArgs,
  CompanyQueryArgs,
  EmployeesQueryArgs,
  EmployeeQueryArgs
} from './types';
import { IResolvers } from '@graphql-tools/utils';
import { Company, Employee } from '@prisma/client';

type EmployeeWithManagerAndCompany = Employee & {
  manager: Employee | null;
  company: Company;
};

type EmployeeWithCompany = Employee & {
  company: Company;
};

async function wouldCreateLoop(employeeId: string, newManagerId: string): Promise<boolean> {
  if (employeeId === newManagerId) {
    return true;
  }

  let currentManagerId: string | null = newManagerId;
  const visitedIds = new Set<string>();

  while (currentManagerId) {
    if (visitedIds.has(currentManagerId)) {
      return true;
    }

    if (currentManagerId === employeeId) {
      return true;
    }

    visitedIds.add(currentManagerId);

    const manager: { managerId: string | null } | null = await prisma.employee.findUnique({
      where: { id: currentManagerId },
      select: { managerId: true }
    });

    currentManagerId = manager?.managerId || null;
  }

  return false;
}

export const resolvers: IResolvers = {
  DateTime: DateTimeResolver,

  Query: {
    companies: async (): Promise<CompanyWithEmployees[]> => {
      return await prisma.company.findMany({
        include: { employees: true }
      });
    },

    company: async (_, args: CompanyQueryArgs): Promise<CompanyWithEmployees | null> => {
      return await prisma.company.findUnique({
        where: { id: args.id },
        include: {
          employees: {
            include: {
              manager: true,
              subordinates: true
            }
          }
        }
      });
    },

    employees: async (_, args: EmployeesQueryArgs): Promise<EmployeeWithRelations[]> => {
      return await prisma.employee.findMany({
        where: { companyId: args.companyId },
        include: {
          company: true,
          manager: true,
          subordinates: true
        }
      });
    },

    employee: async (_, args: EmployeeQueryArgs): Promise<EmployeeWithRelations | null> => {
      return await prisma.employee.findUnique({
        where: { id: args.id },
        include: {
          company: true,
          manager: true,
          subordinates: true
        }
      });
    }
  },

  Mutation: {
    createCompany: async (_, args: CreateCompanyMutationArgs): Promise<CompanyWithEmployees> => {
      return await prisma.company.create({
        data: args.input,
        include: { employees: true }
      });
    },

    deleteCompany: async (_, args: { id: string }): Promise<boolean> => {
      const company = await prisma.company.findUnique({
        where: { id: args.id },
        include: { employees: true }
      });

      if (!company) {
        throw new Error('Company not found');
      }

      if (company.employees.length > 0) {
        throw new Error('Cannot delete company with employees. Please remove all employees first.');
      }

      await prisma.company.delete({
        where: { id: args.id }
      });

      return true;
    },


    createEmployee: async (_, args: CreateEmployeeMutationArgs): Promise<EmployeeWithRelations> => {
      const company = await prisma.company.findUnique({
        where: { id: args.input.companyId }
      });

      if (!company) {
        throw new Error('Company not found');
      }

      return await prisma.employee.create({
        data: args.input,
        include: {
          company: true,
          manager: true,
          subordinates: true
        }
      });
    },

    assignManager: async (_, args: AssignManagerMutationArgs): Promise<EmployeeWithRelations> => {
      const { employeeId, managerId } = args.input;

      const employee: EmployeeWithManagerAndCompany | null = await prisma.employee.findUnique({
        where: { id: employeeId },
        include: { manager: true, company: true }
      });

      const manager: EmployeeWithCompany | null = await prisma.employee.findUnique({
        where: { id: managerId },
        include: { company: true }
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      if (!manager) {
        throw new Error('Manager not found');
      }

      if (employee.companyId !== manager.companyId) {
        throw new Error('Employee and manager must be in the same company');
      }

      if (employee.managerId === managerId) {
        throw new Error(`${employee.name} already reports to ${manager.name}`);
      }

      const hasLoop = await wouldCreateLoop(employeeId, managerId);
      if (hasLoop) {
        throw new Error('This assignment would create a hierarchy loop');
      }

      return await prisma.employee.update({
        where: { id: employeeId },
        data: { managerId },
        include: {
          company: true,
          manager: true,
          subordinates: true
        }
      });
    },

    removeManager: async (_, args: RemoveManagerMutationArgs): Promise<EmployeeWithRelations> => {
      const employee = await prisma.employee.findUnique({
        where: { id: args.employeeId }
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      if (!employee.managerId) {
        throw new Error('Employee does not have a manager');
      }

      return await prisma.employee.update({
        where: { id: args.employeeId },
        data: { managerId: null },
        include: {
          company: true,
          manager: true,
          subordinates: true
        }
      });
    },

    deleteEmployee: async (_, args: DeleteEmployeeMutationArgs): Promise<boolean> => {
      const employee = await prisma.employee.findUnique({
        where: { id: args.id },
        include: { subordinates: true }
      });

      if (!employee) {
        throw new Error('Employee not found');
      }

      if (employee.subordinates.length > 0) {
        await prisma.employee.updateMany({
          where: { managerId: args.id },
          data: { managerId: null }
        });
      }

      await prisma.employee.delete({
        where: { id: args.id }
      });

      return true;
    }
  },

  Company: {
    employeeCount: async (parent: Company): Promise<number> => {
      return await prisma.employee.count({
        where: { companyId: parent.id }
      });
    }
  },

  Employee: {
    peers: async (parent: Employee): Promise<Employee[]> => {
      if (!parent.managerId) {
        return [];
      }

      return await prisma.employee.findMany({
        where: {
          managerId: parent.managerId,
          id: { not: parent.id }
        }
      });
    },

    secondLevelSubordinates: async (parent: Employee): Promise<Employee[]> => {
      const directSubordinates = await prisma.employee.findMany({
        where: { managerId: parent.id },
        select: { id: true }
      });

      if (directSubordinates.length === 0) {
        return [];
      }

      return await prisma.employee.findMany({
        where: {
          managerId: { in: directSubordinates.map(sub => sub.id) }
        }
      });
    },

    subordinates: async (parent: Employee): Promise<Employee[]> => {
      const subordinates = await prisma.employee.findMany({
        where: { managerId: parent.id }
      });

      return subordinates || [];
    }
  }
};

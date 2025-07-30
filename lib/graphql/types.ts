import { Company, Employee } from '@prisma/client';

export interface CreateCompanyInput {
  name: string;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  picture?: string;
  companyId: string;
}

export interface AssignManagerInput {
  employeeId: string;
  managerId: string;
}

export interface GraphQLContext {
  req: Request;
}

export interface GraphQLResolveInfo {
  fieldName: string;
  fieldNodes: unknown[];
  returnType: unknown;
  parentType: unknown;
  path: unknown;
  schema: unknown;
  fragments: Record<string, unknown>;
  rootValue: unknown;
  operation: unknown;
  variableValues: Record<string, unknown>;
}

export interface CompanyWithEmployees extends Company {
  employees: Employee[];
}

export interface EmployeeWithRelations extends Employee {
  company: Company;
  manager?: Employee | null;
  subordinates: Employee[];
}

export interface CompanyQueryArgs {
  id: string;
}

export interface EmployeesQueryArgs {
  companyId: string;
}

export interface EmployeeQueryArgs {
  id: string;
}

export interface CreateCompanyMutationArgs {
  input: CreateCompanyInput;
}

export interface CreateEmployeeMutationArgs {
  input: CreateEmployeeInput;
}

export interface AssignManagerMutationArgs {
  input: AssignManagerInput;
}

export interface RemoveManagerMutationArgs {
  employeeId: string;
}

export interface DeleteEmployeeMutationArgs {
  id: string;
}

export type EmptyObject = Record<string, never>;

export type ResolverFn<TParent, TArgs, TReturn> = (
  parent: TParent,
  args: TArgs,
  context: GraphQLContext,
  info: GraphQLResolveInfo
) => Promise<TReturn> | TReturn;

export type HelloQueryResolverFn = ResolverFn<EmptyObject, EmptyObject, string>;
export type CompaniesQueryResolverFn = ResolverFn<EmptyObject, EmptyObject, CompanyWithEmployees[]>;
export type CompanyQueryResolverFn = ResolverFn<EmptyObject, CompanyQueryArgs, CompanyWithEmployees | null>;
export type EmployeesQueryResolverFn = ResolverFn<EmptyObject, EmployeesQueryArgs, EmployeeWithRelations[]>;
export type EmployeeQueryResolverFn = ResolverFn<EmptyObject, EmployeeQueryArgs, EmployeeWithRelations | null>;

export type CreateCompanyMutationResolverFn = ResolverFn<EmptyObject, CreateCompanyMutationArgs, CompanyWithEmployees>;
export type CreateEmployeeMutationResolverFn = ResolverFn<EmptyObject, CreateEmployeeMutationArgs, EmployeeWithRelations>;
export type AssignManagerMutationResolverFn = ResolverFn<EmptyObject, AssignManagerMutationArgs, EmployeeWithRelations>;
export type RemoveManagerMutationResolverFn = ResolverFn<EmptyObject, RemoveManagerMutationArgs, EmployeeWithRelations>;
export type DeleteEmployeeMutationResolverFn = ResolverFn<EmptyObject, DeleteEmployeeMutationArgs, boolean>;

export type CompanyEmployeeCountResolverFn = ResolverFn<Company, EmptyObject, number>;
export type EmployeePeersResolverFn = ResolverFn<Employee, EmptyObject, Employee[]>;
export type EmployeeSecondLevelSubordinatesResolverFn = ResolverFn<Employee, EmptyObject, Employee[]>;

export interface QueryResolvers {
  hello: HelloQueryResolverFn;
  companies: CompaniesQueryResolverFn;
  company: CompanyQueryResolverFn;
  employees: EmployeesQueryResolverFn;
  employee: EmployeeQueryResolverFn;
}

export interface MutationResolvers {
  createCompany: CreateCompanyMutationResolverFn;
  createEmployee: CreateEmployeeMutationResolverFn;
  assignManager: AssignManagerMutationResolverFn;
  removeManager: RemoveManagerMutationResolverFn;
  deleteEmployee: DeleteEmployeeMutationResolverFn;
}

export interface CompanyFieldResolvers {
  employeeCount: CompanyEmployeeCountResolverFn;
}

export interface EmployeeFieldResolvers {
  peers: EmployeePeersResolverFn;
  secondLevelSubordinates: EmployeeSecondLevelSubordinatesResolverFn;
}

export interface Resolvers {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Company: CompanyFieldResolvers;
  Employee: EmployeeFieldResolvers;
}

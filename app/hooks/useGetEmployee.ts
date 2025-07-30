import { Employee } from "@/frontend/dtos/employee";
import { GET_EMPLOYEE } from "@/lib/graphql/queries";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

export const useGetEmployee = (employeeId: string) => {
  const { data, loading, error } = useQuery(GET_EMPLOYEE, {
    variables: { id: employeeId },
    skip: !employeeId,
  });

  const employee: Employee = useMemo(() => {
    return data?.employee || null;
  }, [data]);

  return {
    employee,
    loading,
    error,
  };
}

import { GET_EMPLOYEES } from "@/lib/graphql/queries";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

export const useFetchEmployees = (companyId: string, visible: boolean) => {
  const { data, loading, error } = useQuery(GET_EMPLOYEES, {
    variables: { companyId },
    skip: !visible,
  });

  const employees = useMemo(() => {
    return data?.employees || [];
  }, [data]);

  return {
    employees,
    loading,
    error
  };
}

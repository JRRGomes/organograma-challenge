import { Company } from "@/frontend/dtos/company";
import { GET_COMPANY } from "@/lib/graphql/queries";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

export const useGetCompany = (companyId: string) => {
  const { data, loading, error } = useQuery(GET_COMPANY, {
    variables: { id: companyId },
    skip: !companyId,
  });

  const company: Company = useMemo(() => {
    return data?.company || null;
  }, [data]);

  return {
    company,
    loading,
    error
  }
}

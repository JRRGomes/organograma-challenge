import { GET_COMPANIES } from "@/lib/graphql/queries";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

export const useFetchCompanies = () => {
  const { data, loading, error } = useQuery(GET_COMPANIES);

  const companies = useMemo(() => {
    return data?.companies || [];
  }, [data]);

  return {
    companies,
    loading,
    error
  };
}

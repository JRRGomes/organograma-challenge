import { ASSIGN_MANAGER, REMOVE_MANAGER } from "@/lib/graphql/mutations";
import { GET_COMPANY, GET_EMPLOYEES } from "@/lib/graphql/queries";
import { ApolloError, useMutation } from "@apollo/client";
import { App } from "antd";
import { useState } from "react";

export const useHandleHierarchy = (employeeId: string, onCancel: () => void, companyId: string) => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const [assignManager] = useMutation(ASSIGN_MANAGER, {
    refetchQueries: [
      { query: GET_EMPLOYEES, variables: { companyId } },
      { query: GET_COMPANY, variables: { id: companyId } },
    ],
  });

  const [removeManager] = useMutation(REMOVE_MANAGER, {
    refetchQueries: [
      { query: GET_EMPLOYEES, variables: { companyId } },
      { query: GET_COMPANY, variables: { id: companyId } },
    ],
  });

  const handleSubmit = async (values: { managerId?: string }) => {
    setLoading(true);
    try {
      if (values.managerId) {
        await assignManager({
          variables: {
            input: {
              employeeId: employeeId,
              managerId: values.managerId,
            },
          },
        });
      } else {
        await removeManager({
          variables: {
            employeeId: employeeId,
          },
        });
      }

      onCancel();
    } catch (error: ApolloError | unknown) {
      if (error instanceof ApolloError && error.message.toLowerCase().includes('this assignment would create a hierarchy loop')) {
        message.error('Não é possível atribuir um gestor que já é subordinado deste funcionário.');
      } else {
        message.error(`Error updating hierarchy: ${error instanceof ApolloError ? error.message : 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };

}

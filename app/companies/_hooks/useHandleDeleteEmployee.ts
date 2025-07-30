import { App } from "antd";
import { useMutation } from "@apollo/client";
import { DELETE_EMPLOYEE } from "@/lib/graphql/mutations";
import { GET_COMPANIES, GET_COMPANY } from "@/lib/graphql/queries";

export const useHandleDeleteEmployee = (companyId: string) => {
  const { message } = App.useApp();

  const [deleteEmployee, { loading: deleteEmployeeLoading }] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [
      { query: GET_COMPANY, variables: { id: companyId } },
      { query: GET_COMPANIES }
    ],
    onCompleted: () => {
      message.success('Funcionário deletado com sucesso!');
    },
    onError: (error) => {
      message.error(`Erro ao deletar funcionário: ${error.message}`);
    },
  });

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployee({
        variables: { id: employeeId }
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };
  return { handleDeleteEmployee, deleteEmployeeLoading };
}

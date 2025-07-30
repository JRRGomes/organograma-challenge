import { Company } from "@/frontend/dtos/company";
import { DELETE_COMPANY } from "@/lib/graphql/mutations";
import { GET_COMPANIES } from "@/lib/graphql/queries";
import { useMutation } from "@apollo/client";
import { App } from "antd";
import { useRouter } from "next/navigation";

export const useHandleDeleteCompany = () => {
  const router = useRouter();
  const { message } = App.useApp();

  const [deleteCompany, { loading: deleteLoading }] = useMutation(DELETE_COMPANY, {
    refetchQueries: [{ query: GET_COMPANIES }],
    onCompleted: () => {
      message.success('Empresa deletada com sucesso!');
      router.push('/');
    },
    onError: (error) => {
      if (error.message.includes('remove all employees first')) {
        message.error('Não é possível deletar a empresa com funcionários. Remova todos os funcionários primeiro.');
      } else {
        message.error(`Erro ao deletar empresa: ${error.message}`);
      }
    },
  });

  const handleDeleteCompany = async (company: Company) => {
    try {
      await deleteCompany({
        variables: { id: company.id }
      });
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };
  return { handleDeleteCompany, deleteLoading };
}

import { CREATE_EMPLOYEE } from "@/lib/graphql/mutations";
import { GET_COMPANIES, GET_COMPANY } from "@/lib/graphql/queries";
import { useMutation } from "@apollo/client";
import { App } from "antd";
import { FormInstance } from "antd/lib";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateEmployeeFormData {
  name: string;
  email: string;
  picture?: string;
  companyId: string;
}

export const useHandleSubmit = (selectedCompanyId: string, form: FormInstance) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [
      { query: GET_COMPANIES },
      ...(selectedCompanyId ? [{ query: GET_COMPANY, variables: { id: selectedCompanyId } }] : [])
    ],
    onCompleted: (data) => {
      message.success(`Funcionário "${data.createEmployee.name}" criado com sucesso!`);
      if (selectedCompanyId) {
        router.push(`/companies/${selectedCompanyId}`);
      } else {
        router.push('/');
      }
    },
    onError: (error) => {
      setLoading(false);
      if (error.message.toLowerCase().includes('unique constraint failed on the fields: (`email`)')) {
        form.setFields([
          {
            name: 'email',
            errors: ['Este email já está em uso'],
          },
        ])
      } else {
        message.error(`Erro ao criar funcionário: ${error.message}`);
      }
    },
  });

  const handleSubmit = async (values: CreateEmployeeFormData) => {
    setLoading(true);
    try {
      await createEmployee({
        variables: {
          input: {
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
            picture: values.picture || null,
            companyId: values.companyId,
          },
        },
      });
    } catch (error) {
      console.error('Error creating employee:', error);
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
}

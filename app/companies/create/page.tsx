'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Typography, Space, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, BuildOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { CREATE_COMPANY } from '../../../lib/graphql/mutations';
import { GET_COMPANIES } from '../../../lib/graphql/queries';

const { Title } = Typography;

interface CreateCompanyFormData {
  name: string;
}

export default function CreateCompanyPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [createCompany] = useMutation(CREATE_COMPANY, {
    refetchQueries: [{ query: GET_COMPANIES }],
    onCompleted: (data) => {
      message.success(`Empresa "${data.createCompany.name}" criada com sucesso!`);
      router.push('/');
    },
    onError: (error) => {
      message.error(`Erro ao criar empresa: ${error.message}`);
      setLoading(false);
    },
  });

  const handleSubmit = async (values: CreateCompanyFormData) => {
    setLoading(true);
    try {
      await createCompany({
        variables: {
          input: {
            name: values.name.trim(),
          },
        },
      });
    } catch (error) {
      console.error('Error creating company:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button icon={<ArrowLeftOutlined />} type="text">
              Voltar
            </Button>
          </Link>
          <Title level={2} className="!mb-0">
            <BuildOutlined className="mr-2" />
            Nova Empresa
          </Title>
        </div>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            label="Nome da Empresa"
            name="name"
            rules={[
              {
                required: true,
                message: 'Por favor, insira o nome da empresa',
              },
              {
                min: 2,
                message: 'O nome deve ter pelo menos 2 caracteres',
              },
              {
                max: 100,
                message: 'O nome deve ter no máximo 100 caracteres',
              },
              {
                pattern: /^[a-zA-ZÀ-ÿ0-9\s&.-]+$/,
                message: 'Nome contém caracteres inválidos',
              },
            ]}
          >
            <Input
              placeholder="Digite o nome da empresa (ex: Tech Solutions)"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item className="!mb-0">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                {loading ? 'Criando...' : 'Criar Empresa'}
              </Button>
              <Link href="/">
                <Button disabled={loading} size="large">
                  Cancelar
                </Button>
              </Link>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="💡 Dicas" size="small">
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• O nome da empresa deve ser único e descritivo</li>
          <li>• Após criar, você poderá adicionar funcionários</li>
          <li>• Use nomes profissionais (ex: &quot;Tech Solutions LTDA&quot;)</li>
        </ul>
      </Card>
    </div>
  );
}

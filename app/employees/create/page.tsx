'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Spin,
  Select,
  Avatar,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  UploadOutlined,
  MailOutlined,
  TeamOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { Company } from '../../../frontend/dtos/company';
import { useFetchCompanies } from '@/app/hooks/useFetchCompanies';
import { useHandleSubmit } from './_hooks/useHandleSubmit';

const { Title } = Typography;
const { Option } = Select;

export default function CreateEmployeePage() {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const { companies, loading: companiesLoading } = useFetchCompanies();
  const { handleSubmit, loading } = useHandleSubmit(selectedCompanyId || "", form);

  const preSelectedCompanyId = searchParams.get('companyId');

  useEffect(() => {
    if (preSelectedCompanyId) {
      setSelectedCompanyId(preSelectedCompanyId);
      form.setFieldValue('companyId', preSelectedCompanyId);
    }
  }, [preSelectedCompanyId, form]);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  if (companiesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={selectedCompanyId ? `/companies/${selectedCompanyId}` : '/'}>
            <Button icon={<ArrowLeftOutlined />} type="text">
              Voltar
            </Button>
          </Link>
          <Title level={2} className="!mb-0">
            <UserOutlined className="mr-2" />
            Novo Funcionário
          </Title>
        </div>
      </div>

      {companies.length === 0 && (
        <Alert
          message="Nenhuma empresa encontrada"
          description="Você precisa criar uma empresa primeiro antes de adicionar funcionários."
          type="warning"
          showIcon
          action={
            <Link href="/companies/create">
              <Button size="small" type="primary">
                Criar Empresa
              </Button>
            </Link>
          }
        />
      )}

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
          disabled={companies.length === 0}
        >
          <Form.Item
            label="Empresa"
            name="companyId"
            rules={[
              {
                required: true,
                message: 'Por favor, selecione uma empresa',
              },
            ]}
          >
            <Select
              placeholder="Selecione a empresa"
              disabled={loading || !!preSelectedCompanyId}
              onChange={handleCompanyChange}
              showSearch
              optionFilterProp="children"
            >
              {companies.map((company: Company) => (
                <Option key={company.id} value={company.id}>
                  <Space>
                    <TeamOutlined />
                    {company.name}
                    <span className="text-gray-500">
                      ({company.employeeCount} funcionários)
                    </span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Nome Completo"
            name="name"
            rules={[
              {
                required: true,
                message: 'Por favor, insira o nome completo',
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
                pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
                message: 'Nome deve conter apenas letras e espaços',
              },
            ]}
          >
            <Input
              placeholder="Digite o nome completo (ex: João Silva)"
              disabled={loading}
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Por favor, insira o email',
              },
              {
                type: 'email',
                message: 'Por favor, insira um email válido',
              },
              {
                max: 100,
                message: 'Email deve ter no máximo 100 caracteres',
              },
            ]}
          >
            <Input
              placeholder="Digite o email (ex: joao@empresa.com)"
              disabled={loading}
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            label="Foto (Opcional)"
            name="picture"
            help="URL da foto do funcionário (ex: https://exemplo.com/foto.jpg)"
          >
            <Input
              placeholder="https://exemplo.com/foto.jpg"
              disabled={loading}
              prefix={<UploadOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, current) => prev.picture !== current.picture}>
            {({ getFieldValue }) => {
              const pictureUrl = getFieldValue('picture');
              return pictureUrl ? (
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Preview:</div>
                  <Avatar
                    size={64}
                    src={pictureUrl}
                    icon={<UserOutlined />}
                    className="shadow-md"
                  />
                </div>
              ) : null;
            }}
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
                {loading ? 'Criando...' : 'Criar Funcionário'}
              </Button>
              <Link href={selectedCompanyId ? `/companies/${selectedCompanyId}` : '/'}>
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
          <li>• Após criar, você poderá definir o gestor deste funcionário</li>
          <li>• Use emails corporativos da empresa</li>
          <li>• A foto é opcional, mas ajuda na identificação</li>
          <li>• Para fotos, use URLs públicas (ex: Gravatar, LinkedIn)</li>
        </ul>
      </Card>
    </div>
  );
}

'use client';

import { Card, Button, Table, Typography, Space, Spin, Alert, Popconfirm } from 'antd';
import { PlusOutlined, TeamOutlined, EyeOutlined, ShopOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useFetchCompanies } from '../hooks/useFetchCompanies';
import { useRouter } from 'next/navigation';
import { Company } from '@/frontend/dtos/company';
import { useHandleDeleteCompany } from './_hooks/useHandleDeleteCompany';

const { Title } = Typography;

export default function ComapaniesPage() {
  const router = useRouter();
  const { companies, loading, error } = useFetchCompanies();

  const { handleDeleteCompany, deleteLoading } = useHandleDeleteCompany();

  const columns = [
    {
      title: 'Empresa',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <TeamOutlined />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'Funcionários',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      render: (count: number) => `${count} funcionário${count !== 1 ? 's' : ''}`,
    },
    {
      title: 'Criada em',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: Company) => (
        <Space>
          <Button icon={<EyeOutlined />} type="primary" onClick={() => router.push(`/companies/${record.id}`)}>
            Ver Detalhes
          </Button>
          <Popconfirm
            title="Deletar Empresa"
            description={`Tem certeza que deseja deletar a empresa "${record.name}"?`}
            okButtonProps={{
              danger: true,
              loading: deleteLoading
            }}
            cancelText="Cancelar"
            okText="Deletar"
            onConfirm={() => handleDeleteCompany(record)}
            disabled={record.employees?.length > 0}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={record.employees?.length > 0}
            >
              Deletar Empresa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Erro ao carregar empresas"
        description={error.message}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <ShopOutlined style={{ fontSize: '24px' }} />
          <Title level={2} className='mt-4'>Empresas Cadastradas</Title>
        </div>
        <Link href="/companies/create">
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Nova Empresa
          </Button>
        </Link>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={companies}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: 'Nenhuma empresa cadastrada ainda',
          }}
        />
      </Card>
    </div>
  );
}

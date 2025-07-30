'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Table,
  Typography,
  Space,
  Spin,
  Alert,
  Avatar,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
  UsergroupAddOutlined,
  PartitionOutlined,
  SettingOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { HierarchyModal } from '@/app/components/HierarchyModal';
import { useGetCompany } from '@/app/hooks/useGetCompany';
import { Employee } from '@/frontend/dtos/employee';
import { useHandleDeleteEmployee } from '../_hooks/useHandleDeleteEmployee';

const { Title, Text } = Typography;

export default function CompanyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  const { company, loading, error } = useGetCompany(companyId);
  const [hierarchyModalVisible, setHierarchyModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { handleDeleteEmployee, deleteEmployeeLoading } = useHandleDeleteEmployee(companyId);

  const openHierarchyModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setHierarchyModalVisible(true);
  };

  const closeHierarchyModal = () => {
    setHierarchyModalVisible(false);
    setSelectedEmployee(null);
  };

  const columns: ColumnsType<Employee> = [
    {
      title: 'Funcionário',
      key: 'employee',
      render: (record: Employee) => (
        <Space>
          <Avatar
            size={40}
            src={record.picture}
            icon={<UserOutlined />}
          />
          <div>
            <div className="font-medium">{record.name}</div>
            <Text type="secondary" className="text-sm">{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Gestor',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager: Employee['manager']) => (
        manager ? (
          <Space>
            <CrownOutlined className="text-yellow-500" />
            <span>{manager.name}</span>
          </Space>
        ) : (
          <Text type="secondary">Nenhum</Text>
        )
      ),
    },
    {
      title: 'Liderados',
      dataIndex: 'subordinates',
      key: 'subordinates',
      render: (subordinates: Employee['subordinates']) => (
        subordinates.length > 0 ? (
          <Space>
            <UsergroupAddOutlined />
            <span>{subordinates.length} pessoa{subordinates.length !== 1 ? 's' : ''}</span>
          </Space>
        ) : (
          <Text type="secondary">Nenhum</Text>
        )
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: Employee) => (
        <Space>
          <Button
            size="small"
            icon={<UserOutlined />}
            onClick={() => router.push(`/employees/${record.id}`)}
          >
            Ver Perfil
          </Button>
          <Tooltip title="Definir Hierarquia">
            <Button
              size="small"
              icon={<SettingOutlined />}
              onClick={() => openHierarchyModal(record)}
            >
              Hierarquia
            </Button>
          </Tooltip>
          <Popconfirm
            title="Deletar Funcionário"
            description={`Tem certeza que deseja deletar a funcionário "${record.name}"?`}
            okButtonProps={{
              danger: true,
              loading: deleteEmployeeLoading
            }}
            cancelText="Cancelar"
            okText="Deletar"
            onConfirm={() => handleDeleteEmployee(record.id)}
            disabled={deleteEmployeeLoading}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={deleteEmployeeLoading}
            >
              Deletar Funcionário
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
        message="Erro ao carregar empresa"
        description={error.message}
        type="error"
        showIcon
        action={
          <Link href="/">
            <Button size="small">Voltar</Button>
          </Link>
        }
      />
    );
  }

  if (!company) {
    return (
      <Alert
        message="Empresa não encontrada"
        description="A empresa que você está procurando não existe ou foi removida."
        type="warning"
        showIcon
        action={
          <Link href="/">
            <Button size="small">Voltar</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button icon={<ArrowLeftOutlined />} type="text">
              Voltar
            </Button>
          </Link>
          <div>
            <Title level={2} className="!mb-0">
              <TeamOutlined className="mr-2" />
              {company.name}
            </Title>
            <Text type="secondary">
              {company.employeeCount} funcionário{company.employeeCount !== 1 ? 's' : ''}
            </Text>
          </div>
        </div>
        <Space>
          <Link href={`/companies/${company.id}/chart`}>
            <Button icon={<PartitionOutlined />}>
              Ver Organograma
            </Button>
          </Link>
          <Link href={`/employees/create?companyId=${company.id}`}>
            <Button type="primary" icon={<PlusOutlined />}>
              Novo Funcionário
            </Button>
          </Link>
        </Space>
      </div>
      <Card title="Funcionários" className="overflow-hidden">
        <Table
          columns={columns}
          dataSource={company.employees}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} funcionários`
          }}
          locale={{
            emptyText: (
              <div className="py-8 text-center">
                <UserOutlined className="text-4xl text-gray-300 mb-4" />
                <div className="text-gray-500 mb-4">
                  Nenhum funcionário cadastrado ainda
                </div>
                <Link href={`/employees/create?companyId=${company.id}`}>
                  <Button type="primary" icon={<PlusOutlined />}>
                    Adicionar Primeiro Funcionário
                  </Button>
                </Link>
              </div>
            ),
          }}
        />
      </Card>
      {selectedEmployee && (
        <HierarchyModal
          visible={hierarchyModalVisible}
          onCancel={closeHierarchyModal}
          employee={selectedEmployee}
          companyId={company.id}
        />
      )}
    </div>
  );
}

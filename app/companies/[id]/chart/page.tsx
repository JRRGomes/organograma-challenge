'use client';
import { useParams } from 'next/navigation';
import {
  Card,
  Button,
  Typography,
  Spin,
  Alert,
  Empty
} from 'antd';
import {
  ArrowLeftOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useGetCompany } from '@/app/hooks/useGetCompany';
import { EmployeeCard } from '@/app/components/EmployeeCard';

const { Title, Text } = Typography;

export default function OrgChartPage() {
  const params = useParams();
  const companyId = params.id as string;
  const { company, loading, error } = useGetCompany(companyId);

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
        message="Erro ao carregar organograma"
        description={error.message}
        type="error"
        showIcon
        action={
          <Link href={`/companies/${companyId}`}>
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

  const topLevelEmployees = company.employees.filter(emp => !emp.manager);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/companies/${company.id}`}>
            <Button icon={<ArrowLeftOutlined />} type="text">
              Voltar para {company.name}
            </Button>
          </Link>
          <Title level={2} className="!mb-0">
            <TeamOutlined className="mr-2" />
            Organograma - {company.name}
          </Title>
        </div>
      </div>

      <Card className="overflow-auto">
        {topLevelEmployees.length > 0 ? (
          <div className="p-8 min-w-fit">
            <div className="flex flex-col items-center space-y-12">
              {topLevelEmployees.map((topEmployee) => (
                <EmployeeCard
                  key={topEmployee.id}
                  employee={topEmployee}
                  allEmployees={company.employees}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <div>Nenhuma hierarquia definida ainda</div>
                  <Text type="secondary" className="text-sm">
                    Todos os funcionários estão sem gestor definido
                  </Text>
                </div>
              }
            >
              <Link href={`/companies/${company.id}`}>
                <Button type="primary">
                  Definir Hierarquias
                </Button>
              </Link>
            </Empty>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card size="small">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {topLevelEmployees.length}
            </div>
            <div className="text-gray-500">Líderes Principais</div>
          </div>
        </Card>
        <Card size="small">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {company.employees.filter(emp => emp.subordinates.length > 0).length}
            </div>
            <div className="text-gray-500">Total de Gestores</div>
          </div>
        </Card>
        <Card size="small">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {company.employees.filter(emp => emp.manager && emp.subordinates.length === 0).length}
            </div>
            <div className="text-gray-500">Colaboradores</div>
          </div>
        </Card>
        <Card size="small">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {company.employees.filter(emp => !emp.manager && emp.subordinates.length === 0).length}
            </div>
            <div className="text-gray-500">Sem Hierarquia</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

'use client';
import { useParams } from 'next/navigation';
import {
  Card,
  Button,
  Typography,
  Space,
  Spin,
  Alert,
  Tag,
  Avatar,
  List,
  Row,
  Col,
  Empty
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  CrownOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  MailOutlined,
  ShopOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useGetEmployee } from '@/app/hooks/useGetEmployee';

const { Title, Text } = Typography;

export default function EmployeeProfilePage() {
  const params = useParams();
  const employeeId = params.id as string;
  const { employee, loading, error } = useGetEmployee(employeeId);

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
        message="Erro ao carregar funcionário"
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

  if (!employee) {
    return (
      <Alert
        message="Funcionário não encontrado"
        description="O funcionário que você está procurando não existe ou foi removido."
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
    <div className="max-w-6xl mx-auto space-y-6 gap-23">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/companies/${employee.company.id}`}>
            <Button icon={<ArrowLeftOutlined />} type="text">
              Voltar para {employee.company.name}
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <div className="flex items-start space-x-6 gap-4">
          <Avatar
            size={80}
            src={employee.picture}
            icon={<UserOutlined />}
            className="shadow-lg"
          />
          <div className="flex-1">
            <Title level={2} className="!mb-2">
              {employee.name}
            </Title>
            <Space direction="vertical" size="small" className="w-full">
              <Space>
                <MailOutlined className="text-gray-400" />
                <Text>{employee.email}</Text>
              </Space>
              <Space>
                <ShopOutlined className="text-gray-400" />
                <Link href={`/companies/${employee.company.id}`}>
                  <Button type="link" className="!p-0 !h-auto">
                    {employee.company.name}
                  </Button>
                </Link>
              </Space>
              {employee.manager && (
                <Space>
                  <CrownOutlined className="text-yellow-500" />
                  <Text>Gestor: </Text>
                  <Link href={`/employees/${employee.manager.id}`}>
                    <Button type="link" className="!p-0 !h-auto">
                      {employee.manager.name}
                    </Button>
                  </Link>
                </Space>
              )}
            </Space>
          </div>
        </div>
      </Card>

      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <UsergroupAddOutlined className="text-blue-500" />
                <span>Liderados Diretos</span>
                <Tag color="blue">{employee.subordinates.length}</Tag>
              </Space>
            }
            size="small"
          >
            {employee.subordinates.length > 0 ? (
              <List
                dataSource={employee.subordinates}
                renderItem={(subordinate) => (
                  <List.Item className="!py-2">
                    <Link href={`/employees/${subordinate.id}`}>
                      <Button type="link" className="!p-0 !h-auto">
                        <Space>
                          <UserOutlined />
                          {subordinate.name}
                        </Space>
                      </Button>
                    </Link>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Nenhum liderado direto"
                className="!my-4"
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <TeamOutlined className="text-green-500" />
                <span>Colegas de Equipe</span>
                <Tag color="green">{employee.peers.length}</Tag>
              </Space>
            }
            size="small"
          >
            {employee.peers.length > 0 ? (
              <div>
                <Text type="secondary" className="text-xs block mb-2">
                  Pessoas com o mesmo gestor
                </Text>
                <List
                  dataSource={employee.peers}
                  renderItem={(peer) => (
                    <List.Item className="!py-2">
                      <Link href={`/employees/${peer.id}`}>
                        <Button type="link" className="!p-0 !h-auto">
                          <Space>
                            <UserOutlined />
                            {peer.name}
                          </Space>
                        </Button>
                      </Link>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  employee.manager
                    ? "Nenhum colega de equipe"
                    : "Sem gestor definido"
                }
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <UsergroupAddOutlined className="text-purple-500" />
                <span>Liderados Indiretos</span>
                <Tag color="purple">{employee.secondLevelSubordinates.length}</Tag>
              </Space>
            }
            size="small"
          >
            {employee.secondLevelSubordinates.length > 0 ? (
              <div>
                <Text type="secondary" className="text-xs block mb-2">
                  Subordinados dos seus liderados diretos
                </Text>
                <List
                  dataSource={employee.secondLevelSubordinates}
                  renderItem={(subordinate) => (
                    <List.Item className="!py-2">
                      <Link href={`/employees/${subordinate.id}`}>
                        <Button type="link" className="!p-0 !h-auto">
                          <Space>
                            <UserOutlined />
                            {subordinate.name}
                          </Space>
                        </Button>
                      </Link>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Nenhum liderado indireto"
                className="!my-4"
              />
            )}
          </Card>
        </Col>
      </Row>
      <Card
        size="small"
        title={
          <div className="flex items-center gap-2">
            <ApartmentOutlined />
            Posição na Hierarquia
          </div>
        }
      >
        <Row gutter={16}>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {employee.peers.length}
              </div>
              <div className="text-gray-500 text-sm">Colegas</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {employee.subordinates.length}
              </div>
              <div className="text-gray-500 text-sm">Liderados Diretos</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {employee.secondLevelSubordinates.length}
              </div>
              <div className="text-gray-500 text-sm">Liderados Indiretos</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(employee.subordinates.length + employee.secondLevelSubordinates.length)}
              </div>
              <div className="text-gray-500 text-sm">Total Liderados</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div >
  );
}

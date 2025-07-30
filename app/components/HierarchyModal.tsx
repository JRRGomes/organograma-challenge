'use client';
import { Modal, Form, Select, Typography, Space, Alert, Spin } from 'antd';
import { UserOutlined, CrownOutlined } from '@ant-design/icons';
import { useFetchEmployees } from '../hooks/useFetchEmployees';
import { Employee } from '@/frontend/dtos/employee';
import { useHandleHierarchy } from './hooks/useHandleHierarchy';

const { Text } = Typography;
const { Option } = Select;

interface HierarchyModalProps {
  visible: boolean;
  onCancel: () => void;
  employee: Employee;
  companyId: string;
}

export const HierarchyModal = ({
  visible,
  onCancel,
  employee,
  companyId
}: HierarchyModalProps) => {
  const [form] = Form.useForm();
  const { handleSubmit, loading } = useHandleHierarchy(employee.id, onCancel, companyId);

  const { employees, loading: employeesLoading } = useFetchEmployees(companyId, visible);
  const availableManagers = employees.filter((emp: Employee) => emp.id !== employee.id);

  return (
    <Modal
      title={
        <Space>
          <CrownOutlined />
          Definir Hierarquia
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Salvar"
      cancelText="Cancelar"
      width={500}
    >
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <UserOutlined className="text-blue-500" />
            <div>
              <div className="font-medium">{employee.name}</div>
              <div className="text-gray-500 text-sm">{employee.email}</div>
            </div>
          </div>
        </div>

        {employee.manager ? (
          <Alert
            message="Gestor atual"
            description={
              <Space>
                <CrownOutlined className="text-yellow-500" />
                <span>{employee.manager.name}</span>
              </Space>
            }
            type="info"
            showIcon={false}
          />
        ) : (
          <Alert
            message="Sem gestor definido"
            description="Este funcionário está no topo da hierarquia (CEO/Diretor)"
            type="warning"
            showIcon={false}
          />
        )}

        {employeesLoading ? (
          <div className="text-center py-4">
            <Spin />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              managerId: employee.manager?.id,
            }}
          >
            <Form.Item
              label="Novo Gestor"
              name="managerId"
              help="Selecione um gestor ou deixe vazio para remover a hierarquia"
            >
              <Select
                placeholder="Selecione um gestor ou deixe vazio"
                allowClear
                showSearch
                optionFilterProp="children"
                disabled={loading}
              >
                {availableManagers.map((manager: Employee) => (
                  <Option key={manager.id} value={manager.id}>
                    <Space>
                      <UserOutlined />
                      <span>{manager.name}</span>
                      <Text type="secondary" className="text-xs">
                        ({manager.email})
                      </Text>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {availableManagers.length === 0 && (
              <Alert
                message="Nenhum gestor disponível"
                description="Não há outros funcionários na empresa para serem gestores."
                type="info"
                className="mt-2"
              />
            )}
          </Form>
        )}
      </div>
    </Modal>
  );
}

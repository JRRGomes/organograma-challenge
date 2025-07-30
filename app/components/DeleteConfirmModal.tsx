'use client';

import { Modal, Typography, Space, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface DeleteConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  title: string;
  description: string;
  warningMessage?: string;
}

export default function DeleteConfirmModal({
  visible,
  onConfirm,
  onCancel,
  loading,
  title,
  description,
  warningMessage
}: DeleteConfirmModalProps) {
  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined className="text-red-500" />
          {title}
        </Space>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Sim, deletar"
      cancelText="Cancelar"
      okType="danger"
      width={500}
    >
      <div className="space-y-4">
        <Text>{description}</Text>

        {warningMessage && (
          <Alert
            message="Atenção"
            description={warningMessage}
            type="warning"
            showIcon
          />
        )}

        <Alert
          message="Esta ação não pode ser desfeita"
          type="error"
          showIcon
        />
      </div>
    </Modal>
  );
}

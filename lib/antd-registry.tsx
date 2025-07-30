'use client';

import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import ptBR from 'antd/locale/pt_BR';

export default function AntdRegistryProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        locale={ptBR}
        theme={{
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 6,
          },
        }}
      >
        <App
          message={{
            duration: 4,
            maxCount: 3,
          }}
          notification={{
            placement: 'topRight',
          }}
        >
          {children}
        </App>
      </ConfigProvider>
    </AntdRegistry>
  );
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AntdRegistryProvider from '../lib/antd-registry'
import ApolloProviderWrapper from '../lib/apollo-provider'
import { BarChartOutlined } from '@ant-design/icons'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Organograma Challenge',
  description: 'Sistema de organograma empresarial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AntdRegistryProvider>
          <ApolloProviderWrapper>
            <div className="min-h-screen bg-gray-50">
              <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <Link href="/" className="flex gap-2">
                    <BarChartOutlined className="text-xl! text-gray-900!" />
                    <h1 className="text-xl font-bold text-gray-900">
                      Sistema de Organograma
                    </h1>
                  </Link>
                </div>
              </header>
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </ApolloProviderWrapper>
        </AntdRegistryProvider>
      </body>
    </html>
  )
}

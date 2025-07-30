import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { HierarchyModal } from '@/app/components/HierarchyModal'
jest.mock('../../app/hooks/useFetchEmployees', () => ({
  useFetchEmployees: () => ({
    employees: [
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@test.com',
        manager: undefined,
        company: { id: 'company1', name: 'Empresa Teste' },
        subordinates: [],
        peers: [],
        secondLevelSubordinates: []
      }
    ],
    loading: false
  })
}))

const mockEmployee = {
  id: '1',
  name: 'João Silva',
  email: 'joao@test.com',
  manager: undefined,
  company: { id: 'company1', name: 'Empresa Teste' },
  subordinates: [],
  peers: [],
  secondLevelSubordinates: []
}

describe('HierarchyModal', () => {
  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    employee: mockEmployee,
    companyId: 'company1'
  }

  it('should render employee information', async () => {
    render(<HierarchyModal {...defaultProps} />)

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@test.com')).toBeInTheDocument()
  })

  it('should show available managers in select', async () => {
    render(<HierarchyModal {...defaultProps} />)

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    await waitFor(() => {
      const option = screen.getByText((content, element) => {
        return content.includes('Maria Santos') &&
          element?.closest('.ant-select-dropdown') !== null
      })
      expect(option).toBeInTheDocument()
    })
  })

  it('should not show the employee as manager option for themselves', async () => {
    render(<HierarchyModal {...defaultProps} />)

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    await waitFor(() => {
      const dropdown = document.querySelector('.ant-select-dropdown')
      expect(dropdown).toBeInTheDocument()

      const optionsWithJoao = screen.queryByText((content, element) => {
        return content.includes('João Silva') &&
          element?.closest('.ant-select-dropdown') !== null
      })
      expect(optionsWithJoao).not.toBeInTheDocument()
    })
  })
})

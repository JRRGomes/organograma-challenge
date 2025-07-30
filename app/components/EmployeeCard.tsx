import Link from 'next/link';
import { Employee } from "@/frontend/dtos/employee";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export const EmployeeCard = ({ employee, allEmployees }: { employee: Employee; allEmployees: Employee[] }) => {
  const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;
  const isTopLevel = !employee.manager;

  return (
    <div className="flex flex-col items-center space-y-4">
      <Link href={`/employees/${employee.id}`}>
        <div className={`
        relative bg-white rounded-lg p-4 shadow-lg border-2 min-w-[220px]
        ${isTopLevel ? 'border-yellow-400 bg-yellow-50' : 'border-blue-200'}
        hover:shadow-xl transition-all duration-300
        `}>
          <div className="flex items-center space-x-3 gap-2">
            <Avatar
              size={isTopLevel ? 50 : 44}
              src={employee.picture}
              icon={<UserOutlined />}
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {employee.name}
              </div>
              <div className="text-gray-500 text-sm truncate">
                {employee.email}
              </div>
              {employee.manager && (
                <div className="text-blue-600 text-xs">
                  Gestor: {employee.manager.name}
                </div>
              )}
              {hasSubordinates && (
                <div className="text-green-600 text-xs font-medium">
                  {employee.subordinates.length} liderado{employee.subordinates.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
      {hasSubordinates && (
        <div className="flex flex-col items-center space-y-4">
          <div className={`
            grid gap-6
            ${employee.subordinates.length === 1 ? 'grid-cols-1' :
              employee.subordinates.length === 2 ? 'grid-cols-2' :
                employee.subordinates.length === 3 ? 'grid-cols-3' :
                  'grid-cols-2 lg:grid-cols-4'
            }
            `}>
            {employee.subordinates.map((subData) => {
              const fullSubordinate = allEmployees.find(emp => emp.id === subData.id);
              if (!fullSubordinate) return null;

              return (
                <div key={subData.id} className="flex flex-col items-center">
                  <div className="mb-4 w-px h-8 bg-gray-400"></div>
                  <EmployeeCard employee={fullSubordinate} allEmployees={allEmployees} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

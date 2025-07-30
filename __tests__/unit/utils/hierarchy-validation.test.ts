import { PrismaClient } from '@prisma/client'

const mockPrisma = {
  employee: {
    findUnique: jest.fn(),
  },
} as unknown as PrismaClient;

async function wouldCreateLoop(
  employeeId: string,
  newManagerId: string,
  prisma: PrismaClient
): Promise<boolean> {
  if (employeeId === newManagerId) {
    return true;
  }

  let currentManagerId: string | null = newManagerId;
  const visitedIds = new Set<string>();

  while (currentManagerId) {
    if (visitedIds.has(currentManagerId)) {
      return true;
    }

    if (currentManagerId === employeeId) {
      return true;
    }

    visitedIds.add(currentManagerId);

    const manager: { managerId: string | null } | null = await prisma.employee.findUnique({
      where: { id: currentManagerId },
      select: { managerId: true }
    });

    currentManagerId = manager?.managerId || null;
  }

  return false;
}

describe('Hierarchy Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('wouldCreateLoop', () => {
    it('should prevent self-management', async () => {
      const result = await wouldCreateLoop('user1', 'user1', mockPrisma)
      expect(result).toBe(true)
    })

    it('should prevent direct loop (A manages B, B tries to manage A)', async () => {
      mockPrisma.employee.findUnique = jest.fn().mockResolvedValueOnce({
        managerId: 'user1'
      })

      const result = await wouldCreateLoop('user1', 'user2', mockPrisma)
      expect(result).toBe(true)
    })

    it('should prevent indirect loop (A→B→C, C tries to manage A)', async () => {
      mockPrisma.employee.findUnique = jest.fn()
        .mockResolvedValueOnce({ managerId: 'user2' })
        .mockResolvedValueOnce({ managerId: 'user1' })
        .mockResolvedValueOnce({ managerId: null })

      const result = await wouldCreateLoop('user1', 'user3', mockPrisma)
      expect(result).toBe(true)
    })

    it('should allow valid hierarchy assignment', async () => {
      mockPrisma.employee.findUnique = jest.fn()
        .mockResolvedValueOnce({ managerId: null })

      const result = await wouldCreateLoop('user1', 'user4', mockPrisma)
      expect(result).toBe(false)
    })

    it('should handle employees without managers', async () => {
      mockPrisma.employee.findUnique = jest.fn()
        .mockResolvedValueOnce({ managerId: null })

      const result = await wouldCreateLoop('user1', 'user2', mockPrisma)
      expect(result).toBe(false)
    })
  })
})

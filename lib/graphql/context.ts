import { PrismaClient } from '@prisma/client'
import { prisma } from '../prisma'

export interface GraphQLContext {
  prisma: PrismaClient
}

export function createContext(): GraphQLContext {
  return {
    prisma
  }
}

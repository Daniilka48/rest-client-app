import { prisma } from './prisma';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  })),
}));

describe('Prisma client', () => {
  it('should create a PrismaClient instance with $connect and $disconnect', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe('function');
    expect(typeof prisma.$disconnect).toBe('function');
  });

  it('should assign global.prisma in non-production', () => {
    if (process.env.NODE_ENV !== 'production') {
      expect(global.prisma).toBeDefined();
      expect(typeof global.prisma?.$connect).toBe('function');
      expect(typeof global.prisma?.$disconnect).toBe('function');
    }
  });

  it('should use existing global.prisma if it exists', async () => {
    const originalPrisma = global.prisma;

    const mockClient: PrismaClient = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    } as unknown as PrismaClient;

    global.prisma = mockClient;

    const prismaModule = await import('./prisma');

    expect(prismaModule.prisma).toBeDefined();
    expect(typeof prismaModule.prisma.$connect).toBe('function');
    expect(typeof prismaModule.prisma.$disconnect).toBe('function');

    global.prisma = originalPrisma;
  });
});

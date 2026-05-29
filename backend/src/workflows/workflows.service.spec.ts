import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { PrismaService } from '../prisma/prisma.service';

// Mock typé du delegate Prisma `workflow`
const prismaMock = {
  workflow: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Helper : une ligne telle que stockée en base (nodes/edges sérialisés en JSON)
const dbRow = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: 1,
  name: 'Workflow test',
  description: null,
  status: 'DRAFT',
  nodes: JSON.stringify([{ id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: {} }]),
  edges: JSON.stringify([]),
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('WorkflowsService', () => {
  let service: WorkflowsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<WorkflowsService>(WorkflowsService);
  });

  describe('findAll', () => {
    it('retourne la liste resumee triee par updatedAt desc', async () => {
      const rows = [{ id: 2 }, { id: 1 }];
      prismaMock.workflow.findMany.mockResolvedValue(rows);

      const result = await service.findAll();

      expect(result).toBe(rows);
      expect(prismaMock.workflow.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { updatedAt: 'desc' } }),
      );
    });
  });

  describe('findOne', () => {
    it('parse les nodes/edges JSON en objets', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue(dbRow());

      const result = await service.findOne(1);

      expect(prismaMock.workflow.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.nodes).toEqual([
        { id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: {} },
      ]);
      expect(result.edges).toEqual([]);
    });

    it('leve NotFoundException si le workflow est introuvable', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('serialise nodes/edges puis renvoie l objet parse', async () => {
      const nodes = [{ id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: {} }];
      prismaMock.workflow.create.mockResolvedValue(
        dbRow({ nodes: JSON.stringify(nodes) }),
      );

      const result = await service.create({
        name: 'Workflow test',
        nodes: nodes as never,
        edges: [],
      });

      expect(prismaMock.workflow.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Workflow test',
          nodes: JSON.stringify(nodes),
          edges: JSON.stringify([]),
        }),
      });
      expect(result.nodes).toEqual(nodes);
    });
  });

  describe('update', () => {
    it('interdit le passage DRAFT -> CANCELLED (409)', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue(dbRow({ status: 'DRAFT' }));

      await expect(
        service.update(1, { status: 'CANCELLED' as never }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(prismaMock.workflow.update).not.toHaveBeenCalled();
    });

    it('autorise VALIDATED -> CANCELLED', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue(dbRow({ status: 'VALIDATED' }));
      prismaMock.workflow.update.mockResolvedValue(dbRow({ status: 'CANCELLED' }));

      const result = await service.update(1, { status: 'CANCELLED' as never });

      expect(prismaMock.workflow.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'CANCELLED' },
      });
      expect(result.status).toBe('CANCELLED');
    });

    it('ne met a jour que les champs fournis', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue(dbRow());
      prismaMock.workflow.update.mockResolvedValue(dbRow({ name: 'Renomme' }));

      await service.update(1, { name: 'Renomme' });

      expect(prismaMock.workflow.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Renomme' },
      });
    });
  });

  describe('remove', () => {
    it('interdit la suppression d un workflow VALIDATED (409)', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue(dbRow({ status: 'VALIDATED' }));

      await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
      expect(prismaMock.workflow.delete).not.toHaveBeenCalled();
    });

    it('supprime un brouillon', async () => {
      prismaMock.workflow.findUnique.mockResolvedValue(dbRow({ status: 'DRAFT' }));
      prismaMock.workflow.delete.mockResolvedValue(dbRow());

      await service.remove(1);

      expect(prismaMock.workflow.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});

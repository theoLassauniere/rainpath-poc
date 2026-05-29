import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.workflow.findMany({
      select: { id: true, name: true, description: true, status: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const workflow = await this.prisma.workflow.findUnique({ where: { id } });
    if (!workflow) throw new NotFoundException(`Workflow #${id} not found`);
    return {
      ...workflow,
      nodes: JSON.parse(workflow.nodes as string),
      edges: JSON.parse(workflow.edges as string),
    };
  }

  async create(dto: CreateWorkflowDto) {
    const workflow = await this.prisma.workflow.create({
      data: {
        name: dto.name,
        description: dto.description,
        nodes: JSON.stringify(dto.nodes),
        edges: JSON.stringify(dto.edges),
      },
    });
    return {
      ...workflow,
      nodes: JSON.parse(workflow.nodes as string),
      edges: JSON.parse(workflow.edges as string),
    };
  }

  async update(id: number, dto: UpdateWorkflowDto) {
    await this.findOne(id);
    const workflow = await this.prisma.workflow.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.nodes !== undefined && { nodes: JSON.stringify(dto.nodes) }),
        ...(dto.edges !== undefined && { edges: JSON.stringify(dto.edges) }),
      },
    });
    return {
      ...workflow,
      nodes: JSON.parse(workflow.nodes as string),
      edges: JSON.parse(workflow.edges as string),
    };
  }

  async remove(id: number) {
    const workflow = await this.findOne(id);
    if (workflow.status === 'VALIDATED') {
      throw new ConflictException(
        'Un workflow validé doit être annulé avant de pouvoir être supprimé',
      );
    }
    return this.prisma.workflow.delete({ where: { id } });
  }
}

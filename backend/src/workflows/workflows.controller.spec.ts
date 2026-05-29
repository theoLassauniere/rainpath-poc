import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';

const serviceMock = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('WorkflowsController', () => {
  let controller: WorkflowsController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowsController],
      providers: [{ provide: WorkflowsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<WorkflowsController>(WorkflowsController);
  });

  it('GET /workflows delegue a findAll', async () => {
    serviceMock.findAll.mockResolvedValue([{ id: 1 }]);
    await expect(controller.findAll()).resolves.toEqual([{ id: 1 }]);
    expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('GET /workflows/:id delegue a findOne avec l id parse', async () => {
    serviceMock.findOne.mockResolvedValue({ id: 1 });
    await controller.findOne(1);
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('POST /workflows delegue a create avec le DTO', async () => {
    const dto = { name: 'W', nodes: [], edges: [] };
    serviceMock.create.mockResolvedValue({ id: 1, ...dto });
    await controller.create(dto as never);
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('PATCH /workflows/:id delegue a update avec id et DTO', async () => {
    const dto = { name: 'Renomme' };
    serviceMock.update.mockResolvedValue({ id: 1, ...dto });
    await controller.update(1, dto as never);
    expect(serviceMock.update).toHaveBeenCalledWith(1, dto);
  });

  it('DELETE /workflows/:id delegue a remove', async () => {
    serviceMock.remove.mockResolvedValue(undefined);
    await controller.remove(1);
    expect(serviceMock.remove).toHaveBeenCalledWith(1);
  });
});

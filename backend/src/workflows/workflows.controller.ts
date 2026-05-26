import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@ApiTags('workflows')
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  @ApiOperation({ summary: 'List all workflows (summary only)' })
  findAll() {
    return this.workflowsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workflow with full nodes & edges' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workflowsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  create(@Body() dto: CreateWorkflowDto) {
    return this.workflowsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing workflow' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWorkflowDto) {
    return this.workflowsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a workflow' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workflowsService.remove(id);
  }
}

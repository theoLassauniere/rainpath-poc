import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class PositionDto {
  @IsNotEmpty() x: number;
  @IsNotEmpty() y: number;
}

class NodeDataDto {
  @IsString() label: string;
  [key: string]: unknown;
}

class WorkflowNodeDto {
  @IsString() id: string;
  @IsString() type: string;
  @ValidateNested() @Type(() => PositionDto) position: PositionDto;
  @ValidateNested() @Type(() => NodeDataDto) data: NodeDataDto;
}

class WorkflowEdgeDto {
  @IsString() id: string;
  @IsString() source: string;
  @IsString() target: string;
  @IsOptional() @IsString() sourceHandle?: string;
  @IsOptional() @IsString() targetHandle?: string;
  @IsOptional() @IsString() label?: string;
}

export class CreateWorkflowDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ type: [Object] }) @IsArray() @ValidateNested({ each: true }) @Type(() => WorkflowNodeDto) nodes: WorkflowNodeDto[];
  @ApiProperty({ type: [Object] }) @IsArray() @ValidateNested({ each: true }) @Type(() => WorkflowEdgeDto) edges: WorkflowEdgeDto[];
}

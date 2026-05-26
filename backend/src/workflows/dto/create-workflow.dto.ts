import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty, IsEnum, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkflowStatus } from '@prisma/client';

class PositionDto {
  @IsNotEmpty() x: number;
  @IsNotEmpty() y: number;
}

class WorkflowNodeDto {
  @IsString() id: string;
  @IsString() type: string;
  @ValidateNested() @Type(() => PositionDto) position: PositionDto;
  // data est de la donnée brute — on valide uniquement que c'est un objet,
  // sans transformation class-transformer qui stripperait les champs inconnus
  @IsObject() data: Record<string, unknown>;
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
  @ApiPropertyOptional({ enum: WorkflowStatus, default: WorkflowStatus.DRAFT })
  @IsOptional() @IsEnum(WorkflowStatus) status?: WorkflowStatus;
  @ApiProperty({ type: [Object] }) @IsArray() @ValidateNested({ each: true }) @Type(() => WorkflowNodeDto) nodes: WorkflowNodeDto[];
  @ApiProperty({ type: [Object] }) @IsArray() @ValidateNested({ each: true }) @Type(() => WorkflowEdgeDto) edges: WorkflowEdgeDto[];
}

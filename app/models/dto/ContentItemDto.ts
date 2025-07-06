import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsObject,
} from "class-validator";

export class CreateContentItemDto {
  @IsString()
  section_id!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  link_url?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  display_order?: number;
}

export class UpdateContentItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  link_url?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  display_order?: number;
}

import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsObject,
} from "class-validator";

export class CreateContentSectionDto {
  @IsString()
  section_key!: string;

  @IsString()
  title!: string;

  @IsString()
  content!: string;

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

export class UpdateContentSectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

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

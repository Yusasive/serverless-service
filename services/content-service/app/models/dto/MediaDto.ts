import { IsString, IsOptional } from "class-validator";

export class UploadImageDto {
  @IsString()
  file!: string; 

  @IsString()
  filename!: string;

  @IsString()
  contentType!: string;

  @IsOptional()
  @IsString()
  folder?: string;
}

export class DeleteImageDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  key?: string;
}

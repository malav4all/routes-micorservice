// src/common/dto/api-response.dto.ts
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty({ example: null, nullable: true })
  data?: T | null;

  @ApiProperty({ example: null, nullable: true })
  errors?: string;

  constructor(
    success: boolean,
    statusCode: number,
    message: string,
    data?: T | null,
    errors?: string,
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data || null;
    this.errors = errors;
  }

  static success<T>(
    data: T,
    message: string = 'Operation successful',
    statusCode: number = HttpStatus.OK,
  ): ApiResponse<T> {
    return new ApiResponse<T>(true, statusCode, message, data);
  }

  static error<T = any>(
    message: string,
    errors?: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ): ApiResponse<T> {
    return new ApiResponse<T>(false, statusCode, message, null, errors);
  }
}

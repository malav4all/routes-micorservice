import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CoordinateDto {
  @ApiProperty({ description: 'Source name', example: 'Home to Work' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Latitude coordinate', example: 40.7128 })
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ description: 'Longitude coordinate', example: -74.006 })
  @IsNumber()
  @IsNotEmpty()
  lng: number;
}

export class DistanceDto {
  @ApiProperty({ description: 'Distance value in meters', example: 12345 })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({ description: 'Formatted distance text', example: '12.3 km' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class DurationDto {
  @ApiProperty({ description: 'Duration value in seconds', example: 3600 })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({ description: 'Formatted duration text', example: '1 hour' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export enum TravelMode {
  DRIVING = 'DRIVING',
  WALKING = 'WALKING',
  BICYCLING = 'BICYCLING',
  TRANSIT = 'TRANSIT',
}

export class CreateRouteDto {
  @ApiProperty({ description: 'Route name', example: 'Home to Work' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Travel mode',
    enum: TravelMode,
    example: TravelMode.DRIVING,
  })
  @IsEnum(TravelMode)
  @IsNotEmpty()
  travelMode: TravelMode;

  @ApiProperty({ type: DistanceDto })
  @ValidateNested()
  @Type(() => DistanceDto)
  @IsNotEmpty()
  distance: DistanceDto;

  @ApiProperty({ type: DurationDto })
  @ValidateNested()
  @Type(() => DurationDto)
  @IsNotEmpty()
  duration: DurationDto;

  @ApiProperty({ type: CoordinateDto })
  @ValidateNested()
  @Type(() => CoordinateDto)
  @IsNotEmpty()
  origin: CoordinateDto;

  @ApiProperty({ type: CoordinateDto })
  @ValidateNested()
  @Type(() => CoordinateDto)
  @IsNotEmpty()
  destination: CoordinateDto;

  @ApiProperty({ type: [CoordinateDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  @IsOptional()
  waypoints?: CoordinateDto[];

  @ApiProperty({ type: [CoordinateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  @IsNotEmpty()
  path: CoordinateDto[];

  @ApiProperty({ description: 'User ID', required: false })
  @IsString()
  @IsOptional()
  userId?: string;
}

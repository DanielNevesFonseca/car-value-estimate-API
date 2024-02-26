import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDTO {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  longitude: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  latitude: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(1000000)
  mileage: number;
}

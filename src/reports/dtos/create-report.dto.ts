import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export interface ICreateReportDTO {
  price: number;
  brand: string;
  model: string;
  year: number;
  longitude: number;
  latitude: number;
  mileage: number;
}

export class CreateReportDTO implements ICreateReportDTO {
  @IsNumber()
  @Min(1)
  @Max(1000000)
  price: number;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsLatitude()
  longitude: number;

  @IsLongitude()
  latitude: number;

  @IsNumber()
  @Min(1)
  @Max(1000000)
  mileage: number;
}

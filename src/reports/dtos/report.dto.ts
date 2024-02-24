import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/users.entity';

export class ReportDTO {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  brand: string;
  @Expose()
  model: string;
  @Expose()
  year: number;
  @Expose()
  longitude: number;
  @Expose()
  latitude: number;
  @Expose()
  mileage: number;
  @Expose()
  approved: boolean;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}

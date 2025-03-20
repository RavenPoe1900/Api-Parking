import { PartialType } from '@nestjs/swagger';
import { CreateVehicleDetailDto } from './create-vehicleDetail.dto';

export class UpdateVehicleDetailDto extends PartialType(
  CreateVehicleDetailDto,
) {}

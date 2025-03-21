import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(`"${value}" is not a valid number.`);
    }

    if (parsedValue <= 0) {
      throw new BadRequestException(`"${value}" must be a positive integer.`);
    }

    return parsedValue;
  }
}

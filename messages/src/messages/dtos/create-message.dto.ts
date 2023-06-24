import { IsSingleLine } from '@nestjsi/class-validator/is/is-single-line';
import { IsString } from 'class-validator';
export class CreateMessageDto {
  @IsString()
  content: string;
}

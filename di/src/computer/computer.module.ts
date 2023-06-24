import { Module } from '@nestjs/common';
import { ComputerController } from './computer.controller';
import { CpuModule } from 'src/cpu/cpu.module';
import { DiskModule } from 'src/disk/disk.module';

@Module({
  imports: [DiskModule, CpuModule],
  controllers: [ComputerController],
})
export class ComputerModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from './orm/mongoose/mongoose.module';

@Module({
  imports: [DatabaseModule],
  exports: [DatabaseModule],
})
export class InfrastructureModule {}

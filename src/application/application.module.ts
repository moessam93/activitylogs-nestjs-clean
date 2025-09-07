import { Module } from '@nestjs/common';
import { AddActivityLogUseCase } from './use-cases/add-activitylog.usecase';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [AddActivityLogUseCase],
  exports: [AddActivityLogUseCase],
})
export class ApplicationModule {}

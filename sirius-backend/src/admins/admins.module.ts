import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService],
  imports: [TypeOrmModule.forFeature([Admin])],
})
export class AdminsModule {}

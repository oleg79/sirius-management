import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TeachersModule,
    StudentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

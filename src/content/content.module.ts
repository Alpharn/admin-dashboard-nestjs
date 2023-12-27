import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AwsModule } from 'src/aws/aws.module';
import { RolesModule } from 'src/roles/roles.module';
import { ContentService } from './services/content.service';
import { ContentController } from './controllers/content.controller';
import { Content, ContentSchema } from './schema/content.schema';

@Module({
  imports: [
    forwardRef(() => AwsModule),
    forwardRef(() => RolesModule),
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
  ],
  providers: [ContentService],
  controllers: [ContentController]
})
export class ContentModule {}
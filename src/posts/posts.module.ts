import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { RolesModule } from 'src/roles/roles.module';
import { Post, PostsSchema } from './schemas/posts.schema';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService]
})
export class PostsModule {}

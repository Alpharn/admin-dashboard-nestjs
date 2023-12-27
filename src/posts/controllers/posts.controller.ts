import { Body, Controller, Get, Param, Post, Delete, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Post as PostEntity } from '../schemas/posts.schema';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdatePostResult } from 'src/shared/interfaces/shared.interfaces';

@ApiBearerAuth()
@ApiTags('posts')
@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post('create/post')
  async createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto);
  }

  @Get('all')
  async getAllPosts(): Promise<PostEntity[]> {
    return this.postsService.getAllPosts();
  }

  @Get(':title')
  async getPostByTitle(@Param('title') title: string): Promise<PostEntity> {
    return this.postsService.getPostByTitle(title);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.getPostById(id);
  }

  @Patch(':id')
  async updatePost(
    @Param('id') id: string, 
    @Body() updatePostDto: UpdatePostDto): Promise<UpdatePostResult> {
    const result = await this.postsService.updatePost(id, updatePostDto);
    return {
      post: result.post,
      message: result.message
    };
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post, PostDocument } from '../schemas/posts.schema';
import { UpdatePostResult } from 'src/shared/interfaces/shared.interfaces';


@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const titleExists = await this.postModel.exists({ title: createPostDto.title });
    if (titleExists) {
      throw new BadRequestException('Post with such title already exists');
    }
  
    const newPost = new this.postModel({
      ...createPostDto,
      date: new Date(),
    });
    return newPost.save();
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async getPostByTitle(title: string): Promise<Post> {
    const post = await this.postModel.findOne({ title }).exec();
    if (!post) {
      throw new NotFoundException(`Post with title '${title}' not found`);
    }
    return post;
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<UpdatePostResult> {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  
    return {
      post: updatedPost,
      message: 'Post has been successfully updated'
    };
  }

  async deletePost(id: string): Promise<void> {
    const result = await this.postModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
}

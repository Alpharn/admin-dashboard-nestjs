import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Patch,
  Param,
  Delete,
  Get
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import mongoose from 'mongoose';

import { ContentService } from '../services/content.service';
import { ContentDocument } from '../schema/content.schema';
import { fileFilter } from 'src/utils/file-filter';

@ApiBearerAuth()
@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) { }

  @Post('create/content')
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        parent: {
          type: 'string',
          description: 'Parent ID (User or Post ID)',
        },
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('parent') parent: string,
  ): Promise<ContentDocument> {
    if (!file) throw new BadRequestException('File is required');
    return this.contentService.uploadContent(file, parent);
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        parent: {
          type: 'string',
          description: 'Parent ID (User or Post ID)',
        },
      },
    },
  })
  async updateContent(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ContentDocument> {
    return this.contentService.updateContent(id, file);
  }

  @Delete('delete/:id')
  async deleteContent(@Param('id') id: string): Promise<void> {
    return this.contentService.deleteContent(new mongoose.Types.ObjectId(id));
  }

  @Get('get/:id')
  async getContentById(@Param('id') id: string): Promise<ContentDocument> {
    return this.contentService.getContentById(new mongoose.Types.ObjectId(id));
  }

  @Get('all')
  async getAll(): Promise<ContentDocument[]> {
    return this.contentService.getAllContents();
  }
}

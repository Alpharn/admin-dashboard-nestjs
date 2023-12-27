import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

import { AwsService } from 'src/aws/aws.service';
import { Content, ContentDocument } from 'src/content/schema/content.schema';

@Injectable()
export class ContentService {
  constructor(
    private awsService: AwsService,
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>
  ) { }

  async uploadContent(file: Express.Multer.File, parent: string): Promise<ContentDocument> {
    const uploadResult = await this.awsService.uploadFile(file);

    const parentObjectId = new Types.ObjectId(parent);

    const newContent = new this.contentModel({
      url: this.awsService.getFileUrl(uploadResult.Key),
      awsKey: uploadResult.Key,
      parent: parentObjectId,
    });

    return newContent.save();
  }

  async updateContent(id: string, file: Express.Multer.File): Promise<ContentDocument> {
    const currentContent = await this.contentModel.findById(id);
    if (!currentContent) {
      throw new BadRequestException('Content not found');
    }

    const uploadResult = await this.awsService.uploadFile(file);

    await this.awsService.deleteFile(currentContent.awsKey);

    const updatedContent = await this.contentModel.findByIdAndUpdate(
      id,
      {
        awsKey: uploadResult.Key,
        url: this.awsService.getFileUrl(uploadResult.Key),
      },
      { new: true }
    );

    return updatedContent;
  }

  async getContentById(id: mongoose.Types.ObjectId): Promise<ContentDocument> {
    const content = await this.contentModel.findById(id);
    if (!content) {
      throw new BadRequestException('Content not found');
    }
    return content;
  }

  async getAllContents(): Promise<ContentDocument[]> {
    return this.contentModel.find().exec();
  }

  async deleteContent(id: mongoose.Types.ObjectId): Promise<void> {
    const content = await this.contentModel.findById(id);
    if (!content) {
      throw new BadRequestException('Content not found');
    }

    await this.awsService.deleteFile(content.awsKey);
    await this.contentModel.deleteOne({ _id: id });
  }

}
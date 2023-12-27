import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|mp4)$/)) {
    return callback(
      new HttpException('Only image and video files are allowed!', HttpStatus.BAD_REQUEST),
      false
    );
  }
  callback(null, true);
};
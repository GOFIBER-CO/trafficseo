import { NextFunction, Request, Response } from 'express';
import { UploadRequest } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const uploadController = (
  req: UploadRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { image } = req.files;

    let pathFile = uuidv4();
    pathFile = pathFile + '.' + image.name.split('.')[1];
    if (!image) {
      return res.status(400).json({ status: 0, message: 'Image is required' });
    }
    image.mv(path.join(__dirname, `../public/${pathFile}`), (err: any) => {
      if (err) console.log(err);
      else {
        return res.status(200).json({
          status: 1,
          message: 'Image upload successfully',
          pathFile: `${process.env.SERVER_DOMAIN}/${pathFile}`,
        });
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

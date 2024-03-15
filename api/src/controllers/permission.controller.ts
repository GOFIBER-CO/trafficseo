//@ts-nocheck
import { Response } from 'express';
import { ChatRequest } from '../interfaces';
import Permission from '../models/permission.model';

export const getAllPermission = async (req: ChatRequest, res: Response) => {
  try {
    const result = await Permission.find();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};
export const getPermissionByRole = async (req: ChatRequest, res: Response) => {
  try {
    const role = req.query.role;
    const result = await Permission.find({ role: role }).populate('role');
    const data = result?.filter((item) => item.name !== 'permission');
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const getMyPermission = async (req: ChatRequest, res: Response) => {
  try {
    const role = req?.user?.role?._id;
    const result = await Permission.find({ role: role }).populate('role');
    const data = result?.filter((item) => item.name !== 'permission');
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const createPermission = async (req: ChatRequest, res: Response) => {
  try {
    const result = await Permission.findOne({
      name: req.body.name,
      role: req.body.role,
    });
    console.log(result);
    if (result) {
      return res
        .status(400)
        .json({ success: false, message: 'Already have that permission' });
    }

    const permission = new Permission(req.body);

    await permission.save();

    return res.status(200).json({
      success: true,
      message: 'Create permission success!',
      data: permission,
    });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const updatePermission = async (req: ChatRequest, res: Response) => {
  try {
    const result = await Permission.findById(req.params.id);

    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: 'Permission not found!' });
    }

    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: 'Update permission success!',
      data: permission,
    });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};
export const deletePermission = async (req: ChatRequest, res: Response) => {
  try {
    const result = await Permission.findById(req.params.id);

    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: 'Permisson not found!' });
    }

    const permission = await Permission.findByIdAndRemove(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Delete permission success!',
    });
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

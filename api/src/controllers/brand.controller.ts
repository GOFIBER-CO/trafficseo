//@ts-nocheck
import { Request, Response } from 'express';
import brandModel from '../models/brand.model';
import { ChatRequest } from '../interfaces';

// Controller để tạo một thương hiệu mới
export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newBrand = new brandModel({ name });

    const savedBrand = await newBrand.save();

    return res.status(201).json(savedBrand);
  } catch (error) {
    return res.status(500).json({ error: 'Không thể tạo thương hiệu mới.' });
  }
};

// Controller để lấy tất cả các thương hiệu
export const getAllBrands = async (req: ChatRequest, res: Response) => {
  try {
    const {
      pageSize = 10,
      pageIndex = 1,
      search,
      sort = 'createdAt',
    } = req.query;
    const searchCondition = {};
    if (search) {
      searchCondition.name = { $regex: search, $options: 'i' };
    }
    const [brands, totalDocs] = await Promise.all([
      brandModel
        .find(searchCondition)
        .sort({ [sort]: -1 })
        .limit(parseInt(pageSize))
        .skip((parseInt(pageIndex) - 1) * parseInt(pageSize)),
      brandModel.countDocuments(searchCondition),
    ]);

    return res.status(200).json({
      data: brands,
      totalDocs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

// Controller để lấy thông tin thương hiệu theo ID
export const getBrandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await brandModel.findById(id);

    if (!brand) {
      return res.status(404).json({ error: 'Không tìm thấy thương hiệu.' });
    }

    return res.status(200).json(brand);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Không thể lấy thông tin thương hiệu.' });
  }
};

// Controller để cập nhật thông tin thương hiệu theo ID
export const updateBrandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedBrand = await brandModel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedBrand) {
      return res
        .status(404)
        .json({ error: 'Không tìm thấy thương hiệu để cập nhật.' });
    }

    return res.status(200).json(updatedBrand);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Không thể cập nhật thông tin thương hiệu.' });
  }
};

// Controller để xóa thương hiệu theo ID
export const deleteBrandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedBrand = await brandModel.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res
        .status(404)
        .json({ error: 'Không tìm thấy thương hiệu để xóa.' });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: 'Không thể xóa thương hiệu.' });
  }
};

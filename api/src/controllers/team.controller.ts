//@ts-nocheck
import { Request, Response } from 'express';

import { ChatRequest } from '../interfaces';
import teamModel from '../models/team.model';

// Controller để tạo một team mới
export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newTeam = new teamModel({ name });

    const savedTeam = await newTeam.save();

    return res.status(201).json(savedTeam);
  } catch (error) {
    return res.status(500).json({ error: 'Không thể tạo team mới.' });
  }
};

// Controller để lấy tất cả các team
export const getAllTeams = async (req: ChatRequest, res: Response) => {
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
    const [teams, totalDocs] = await Promise.all([
      teamModel
        .find(searchCondition)
        .sort({ [sort]: -1 })
        .limit(parseInt(pageSize))
        .skip((parseInt(pageIndex) - 1) * parseInt(pageSize)),
      teamModel.countDocuments(searchCondition),
    ]);

    return res.status(200).json({
      data: teams,
      totalDocs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

// Controller để lấy thông tin team theo ID
export const getTeamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const team = await teamModel.findById(id);

    if (!team) {
      return res.status(404).json({ error: 'Không tìm thấy team.' });
    }

    return res.status(200).json(team);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Không thể lấy thông tin team.' });
  }
};

// Controller để cập nhật thông tin team theo ID
export const updateTeamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedTeam = await teamModel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedTeam) {
      return res
        .status(404)
        .json({ error: 'Không tìm thấy team để cập nhật.' });
    }

    return res.status(200).json(updatedTeam);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Không thể cập nhật thông tin team.' });
  }
};

// Controller để xóa team theo ID
export const deleteTeamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTeam = await teamModel.findByIdAndDelete(id);
    if (!deletedTeam) {
      return res
        .status(404)
        .json({ error: 'Không tìm thấy team để xóa.' });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ error: 'Không thể xóa team.' });
  }
};

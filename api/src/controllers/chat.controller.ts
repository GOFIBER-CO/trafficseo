import { Response } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ChatRequest } from '../interfaces';

import Message from '../models/message.model';
import { RESPONSE_STATUS } from '../utils';

import { AggressiveTokenizerVi } from 'natural';
// import { skipPartiallyEmittedExpressions } from 'typescript';

class ChatController {
  async sendImage(req: ChatRequest, res: Response) {
    try {
      const image = req.files.image;

      let pathFile = uuidv4();
      pathFile = pathFile + '.' + image.name.split('.')[1];
      if (image) {
        image.mv(
          path.join(__dirname, `../public/${pathFile}`),
          async (err: any) => {
            if (err) console.log(err);
            else {
              const result = await Message.create({
                from: req.user?._id,
                urlPath: pathFile,
                content: req.body.content,
                nameFile: image.name.split('.')[0],
                type: 'image',
              });

              // if (socketToEmit.length > 0)
              //   //@ts-ignore
              //   _io.to(socketToEmit).emit('send message', result);

              const FinalDocs = await Message.findById(result._id).populate(
                'from'
              );
              //@ts-ignore
              _io.emit('send message', FinalDocs);
              //@ts-ignore
              return res.status(200).json({ status: 0, message: FinalDocs });
            }
          }
        );
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getChatByUser(req: ChatRequest, res: Response) {
    try {
      const findMessage = await Message.find({})
        .sort({ createdAt: -1 })
        .lean()
        .limit(1);
      return res.status(200).json({ findMessage });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getMessage(req: ChatRequest, res: Response) {
    try {
      const pageSize = Number(req.query.pageSize) || 10;
      const pageIndex = Number(req.query.pageIndex) || 1;
      const searchModal: any = {};
      if (req.query?.search) {
        searchModal.content = {
          $regex: `.*${req.query?.search}.*`,
          $options: 'i',
        };
      }
      if (req.query?.user) {
        searchModal.from = req.query?.user;
      }
      const [messages, updateMessageReader] = await Promise.all([
        Message.find(searchModal)
          .skip(pageSize * pageIndex - pageSize)
          .limit(pageSize)
          .populate('from')
          .sort({ createdAt: -1 }),
        Message.updateMany(
          { readBy: { $ne: req?.user?._id } },
          {
            $addToSet: {
              readBy: req.user?._id,
            },
          }
        ),
      ]);
      const totalDoc = await Message.find(searchModal).countDocuments();
      const totalPages = Math.ceil(totalDoc / pageSize);
      const response = {
        messages: 'Get message success',
        status: RESPONSE_STATUS.SUCCESS,
        data: {
          messages,
          totalPages,
          totalDoc,
        },
      };
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getMessageNotRead(req: ChatRequest, res: Response) {
    try {
      const result = await Message.find({
        readBy: { $ne: req?.user?._id },
        from: { $ne: req?.user?._id },
      });

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async sendMessage(req: ChatRequest, res: Response) {
    try {
      const contentLowerCase = req.body.content.toLowerCase();
      const badWord = [
        'buồi',
        'buoi',
        'dau buoi',
        'daubuoi',
        'caidaubuoi',
        'nhucaidaubuoi',
        'dau boi',
        'bòi',
        'dauboi',
        'caidauboi',
        'đầu bòy',
        'đầu bùi',
        'dau boy',
        'dauboy',
        'caidauboy',
        'b`',
        'cặc',
        'cak',
        'kak',
        'kac',
        'cac',
        'concak',
        'nungcak',
        'bucak',
        'caiconcac',
        'caiconcak',
        'cu',
        'cặk',
        'cak',
        'dái',
        'giái',
        'zái',
        'kiu',
        'cứt',
        'cuccut',
        'cutcut',
        'cứk',
        'cuk',
        'cười ỉa',
        'cười ẻ',
        'đéo',
        'đếch',
        'đếk',
        'dek',
        'đết',
        'đệt',
        'đách',
        'dech',
        'deo',
        'đel',
        'đél',
        'del',
        'dell ngửi',
        'dell ngui',
        'dell chịu',
        'dell chiu',
        'dell hiểu',
        'dell hieu',
        'dellhieukieugi',
        'dell nói',
        'dell noi',
        'dellnoinhieu',
        'dell biết',
        'dell biet',
        'dell nghe',
        'dell ăn',
        'dell an',
        'dell được',
        'dell duoc',
        'dell làm',
        'dell lam',
        'dell đi',
        'dell di',
        'dell chạy',
        'dell chay',
        'deohieukieugi',
        'địt',
        'đm',
        'dm',
        'đmm',
        'dmm',
        'đmmm',
        'dmmm',
        'đmmmm',
        'dmmmm',
        'đmmmmm',
        'dmmmmm',
        'đcm',
        'dcm',
        'đcmm',
        'dcmm',
        'đcmmm',
        'dcmmm',
        'đcmmmm',
        'dcmmmm',
        'đệch',
        'đệt',
        'dit',
        'dis',
        'diz',
        'đjt',
        'djt',
        'địt mẹ',
        'địt mịe',
        'địt má',
        'địt mía',
        'địt ba',
        'địt bà',
        'địt cha',
        'địt con',
        'địt bố',
        'địt cụ',
        'dis me',
        'disme',
        'dismje',
        'dismia',
        'dis mia',
        'dis mie',
        'đis mịa',
        'đis mịe',
        'ditmemayconcho',
        'ditmemay',
        'ditmethangoccho',
        'ditmeconcho',
        'dmconcho',
        'dmcs',
        'ditmecondi',
        'ditmecondicho',
        'đụ',
        'đụ mẹ',
        'đụ mịa',
        'đụ mịe',
        'đụ má',
        'đụ cha',
        'đụ bà',
        'đú cha',
        'đú con mẹ',
        'đú má',
        'đú mẹ',
        'đù cha',
        'đù má',
        'đù mẹ',
        'đù mịe',
        'đù mịa',
        'đủ cha',
        'đủ má',
        'đủ mẹ',
        'đủ mé',
        'đủ mía',
        'đủ mịa',
        'đủ mịe',
        'đủ mie',
        'đủ mia',
        'đìu',
        'đờ mờ',
        'đê mờ',
        'đờ ma ma',
        'đờ mama',
        'đê mama',
        'đề mama',
        'đê ma ma',
        'đề ma ma',
        'dou',
        'doma',
        'duoma',
        'dou má',
        'duo má',
        'dou ma',
        'đou má',
        'đìu má',
        'á đù',
        'á đìu',
        'đậu mẹ',
        'đậu má',
        'đĩ',
        'di~',
        'đuỹ',
        'điếm',
        'cđĩ',
        'cdi~',
        'đilol',
        'điloz',
        'đilon',
        'diloz',
        'dilol',
        'dilon',
        'condi',
        'condi~',
        'dime',
        'di me',
        'dimemay',
        'condime',
        'condimay',
        'condimemay',
        'con di cho',
        'con di cho',
        'condicho',
        'bitch',
        'biz',
        'bít chi',
        'con bích',
        'con bic',
        'con bíc',
        'con bít',
        'phò',
        'lồn',
        ,
        'loz',
        'lìn',
        'nulo',
        'ml',
        'matlon',
        'cailon',
        'matlol',
        'matloz',
        'thml',
        'thangmatlon',
        'thangml',
        'đỗn lì',
        'tml',
        'thml',
        'diml',
        'dml',
        'hãm',
        'xàm lol',
        'xam lol',
        'xạo lol',
        'xao lol',
        'con lol',
        'ăn lol',
        'an lol',
        'mát lol',
        'mat lol',
        'cái lol',
        'cai lol',
        'lòi lol',
        'loi lol',
        'ham lol',
        'củ lol',
        'cu lol',
        'ngu lol',
        'tuổi lol',
        'tuoi lol',
        'mõm lol',
        'mồm lol',
        'mom lol',
        'như lol',
        'nhu lol',
        'nứng lol',
        'nung lol',
        'nug lol',
        'nuglol',
        'rảnh lol',
        'ranh lol',
        'đách lol',
        'dach lol',
        'mu lol',
        'banh lol',
        'tét lol',
        'tet lol',
        'vạch lol',
        'vach lol',
        'cào lol',
        'cao lol',
        'tung lol',
        'mặt lol',
        'mát lol',
        'mat lol',
        'xàm lon',
        'xam lon',
        'xạo lon',
        'xao lon',
        'con lon',
        'ăn lon',
        'an lon',
        'mát lon',
        'mat lon',
        'cái lon',
        'cai lon',
        'lòi lon',
        'loi lon',
        'ham lon',
        'củ lon',
        'cu lon',
        'ngu lon',
        'tuổi lon',
        'tuoi lon',
        'mõm lon',
        'mồm lon',
        'mom lon',
        'như lon',
        'nhu lon',
        'nứng lon',
        'nung lon',
        'nug lon',
        'nuglon',
        'rảnh lon',
        'ranh lon',
        'đách lon',
        'dach lon',
        'mu lon',
        'banh lon',
        'tét lon',
        'tet lon',
        'vạch lon',
        'vach lon',
        'cào lon',
        'cao lon',
        'tung lon',
        'mặt lon',
        'mát lon',
        'mat lon',
        'cái lờ',
        'cl',
        'clgt',
        'cờ lờ gờ tờ',
        'cái lề gì thốn',
        'đốn cửa lòng',
        'sml',
        'sapmatlol',
        'sapmatlon',
        'sapmatloz',
        'sấp mặt',
        'sap mat',
        'vlon',
        'vloz',
        'vlol',
        'vailon',
        'vai lon',
        'vai lol',
        'vailol',
        'nốn lừng',
        'vcl',
        'vl',
        'vleu',
        'chịch',
        'chich',
        'vãi',
        'v~',
        'đụ',
        'nứng',
        'nug',
        'đút đít',
        'chổng mông',
        'banh háng',
        'xéo háng',
        'xhct',
        'xephinh',
        'la liếm',
        'đổ vỏ',
        'xoạc',
        'xoac',
        'chich choac',
        'húp sò',
        'fuck',
        'fck',
        'đụ',
        'bỏ bú',
        'buscu',
        'ngu',
        'óc chó',
        'occho',
        'lao cho',
        'láo chó',
        'bố láo',
        'chó má',
        'cờ hó',
        'sảng',
        'thằng chó',
        'thang cho',
        'chó điên',
        'thằng điên',
        'thang dien',
        'đồ điên',
        'sủa bậy',
        'sủa tiếp',
        'sủa đi',
        'sủa càn',
        'mẹ bà',
        'mẹ cha mày',
        'me cha may',
        'mẹ cha anh',
        'mẹ cha nhà anh',
        'mẹ cha nhà mày',
        'me cha nha may',
        'mả cha mày',
        'mả cha nhà mày',
        'ma cha may',
        'ma cha nha may',
        'mả mẹ',
        'mả cha',
        'kệ mẹ',
        'kệ mịe',
        'kệ mịa',
        'kệ mje',
        'kệ mja',
        'ke me',
        'ke mie',
        'ke mia',
        'ke mja',
        'ke mje',
        'bỏ mẹ',
        'bỏ mịa',
        'bỏ mịe',
        'bỏ mja',
        'bỏ mje',
        'bo me',
        'bo mia',
        'bo mie',
        'bo mje',
        'bo mja',
        'chetme',
        'chet me',
        'chết mẹ',
        'chết mịa',
        'chết mja',
        'chết mịe',
        'chết mie',
        'chet mia',
        'chet mie',
        'chet mja',
        'chet mje',
        'thấy mẹ',
        'thấy mịe',
        'thấy mịa',
        'thay me',
        'thay mie',
        'thay mia',
        'tổ cha',
        'bà cha mày',
        'cmn',
        'cmnl',
        'tiên sư nhà mày',
        'tiên sư bố',
        'tổ sư',
      ];
      const tokenizer = new AggressiveTokenizerVi();
      const tokens = tokenizer.tokenize(contentLowerCase);

      const isBadWords = tokens.some((token) => badWord.includes(token));

      if (isBadWords) {
        return res.status(200).json({ status: 1, message: 'Bad Message' });
      } else {
        const result = await Message.create({
          from: req.user?._id,
          content: req.body.content,
        });
        const FinalDocs = await Message.findById(result._id).populate('from');
        //@ts-ignore
        console.log(_io);

        //@ts-ignore
        _io.emit('send message', FinalDocs);
        return res.status(200).json({ status: 0, message: FinalDocs });
      }
      // const result = await Message.create({
      //   from: req.user?._id,
      //   content: req.body.content,
      // });

      // const FinalDocs = await Message.findById(result._id).populate('from');
      // //@ts-ignore
      // _io.emit('send message', FinalDocs);

      //  return res.status(200).json({ status: 0, message: {} });
    } catch (error) {
      console.log(error);

      return res.status(500).json(error);
    }
  }
  async deleteMessage(req: ChatRequest, res: Response) {
    try {
      const result = await Message.findByIdAndDelete(req.params.id);
      return res.status(200).json({ status: 1, result });
    } catch (error) {
      console.log(error);

      return res.status(500).json(error);
    }
  }
}

const chatController = new ChatController();
export default chatController;

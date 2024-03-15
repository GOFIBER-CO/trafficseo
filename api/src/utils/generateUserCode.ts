import shortid from 'shortid';

// Tạo mã code duy nhất
export const generateUserCode = () => {
  // const codeLength = 8; // Độ dài mã code bạn muốn tạo
  // Tạo mã code duy nhất sử dụng nanoid
  // const code = nanoid(codeLength);
  const code = shortid.generate();
  return code;
};

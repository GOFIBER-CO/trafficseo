const uploadFileToBunny = async (file) => {
  // console.log("🚀 ~ file: api_bunny.js ~ line 9 ~ uploadFileToBunny ~ file", file)

  var fileName = file.name;
  // fileReader.readAsDataURL(fileName)
  const formData = new FormData();
  const blob = new Blob([file]);
  formData.append("selectedFile", file);
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
      AccessKey: "85a2bd08-fc73-4fd5-966dab5d2c02-32ca-450f",
    },
    body: blob,
  };

  return await fetch(
    "https://sg.storage.bunnycdn.com/gofibervn/Admin/" +
      fileName.replace(/\s/g, "-"),
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("image", data);
      return data;
    })
    .catch((err) => console.error(err));
};
const getListImageBunny = async () => {
  const options = {
    method: "GET",
  };

  return await fetch("http://localhost:8000/api/v1/getAllImage", options)
    .then((response) => response.json())
    .then((response) => {
      return response.image;
    })
    .catch((err) => console.error(err));
};
const deleteImageBunny = async (fileName) => {
  const options = {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      AccessKey: "f9e3afdd-1370-42a8-924150b950c1-eab4-4ecf",
    },
  };

  return fetch(
    "https://sg.storage.bunnycdn.com/baovietnam/" + fileName,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));
};
export { uploadFileToBunny, getListImageBunny, deleteImageBunny };

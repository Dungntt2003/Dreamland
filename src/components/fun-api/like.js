import likeApi from "api/likeApi";

const clickLike = async (params) => {
  try {
    const response = await likeApi.createLike(params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const unLike = async (params) => {
  try {
    const response = await likeApi.deleteLike(params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const handleLike = async (status, params) => {
  const action = status ? unLike : clickLike;
  const response = await action(params);
  // console.log(response);
};
export { clickLike, unLike, handleLike };

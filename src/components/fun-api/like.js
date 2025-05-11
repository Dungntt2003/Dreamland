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
  console.log(response);
};

const checkMatchService = (likedService, id, type) => {
  return likedService.some(
    (service) => service.service_id === id && service.service_type === type
  );
};

export { clickLike, unLike, handleLike, checkMatchService };

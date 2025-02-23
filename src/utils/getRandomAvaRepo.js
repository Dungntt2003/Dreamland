import img1Repo from "assets/image/img1Repo.jpeg";
import img2Repo from "assets/image/img2Repo.jpeg";
import img3Repo from "assets/image/img3Repo.jpeg";
import img4Repo from "assets/image/img4Repo.jpeg";
import img5Repo from "assets/image/img5Repo.jpeg";
const images = [img1Repo, img2Repo, img3Repo, img4Repo, img5Repo];
const getRadomAva = () => {
  return images[Math.floor(Math.random() * images.length)];
};

const getAvaFromIndex = (index) => {
  return images[index % images.length];
};

export { getRadomAva, getAvaFromIndex };

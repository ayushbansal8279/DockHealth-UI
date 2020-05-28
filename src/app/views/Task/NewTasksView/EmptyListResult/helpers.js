import ResultImage from 'img/empty-search-result';
import ResultImage1 from 'img/empty-search-result-1';
import ResultImage2 from 'img/empty-search-result-2';

const searchEmptyResultImages = [ResultImage, ResultImage1, ResultImage2];

export const getRandomEmptySearchResultImage = () => {
  return searchEmptyResultImages[
    Math.floor(Math.random() * searchEmptyResultImages.length)
  ];
};

export default { getRandomEmptySearchResultImage };

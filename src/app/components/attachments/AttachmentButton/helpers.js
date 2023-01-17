import { Image, Movie, Description, Audiotrack } from '@material-ui/icons';

export const getIconFromContentType = ({ contentType }) => {
  if (contentType.startsWith('image/')) {
    return Image;
  }

  if (contentType.startsWith('video/')) {
    return Movie;
  }

  if (contentType.startsWith('audio/')) {
    return Audiotrack;
  }

  return Description;
};

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import CubesLoader from '../components/common/CubesLoader';
import Spacing from '../components/common/Spacing';
import useBoolean from '../hooks/useBoolean';

const SupportVideosContainer = styled.div`
  display: grid;
  grid-gap: 2rem 1rem;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
`;

const SupportViewLink = styled.a`
  color: #007cab;
`;

const SupportVideoContainerElement = styled.div`
  position: relative;
  width: 100%;
`;

const SupportVideoOverlay = styled(motion.div)`
  align-items: center;
  bottom: 0;
  display: flex;
  left: 0;
  position: absolute;
  justify-content: center;
  right: 0;
  top: 0;
  z-index: 1;
`;

const animationProperties = {
  variants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  initial: 'hidden',
  exit: 'hidden',
  animate: 'visible',
  transition: { ease: 'backInOut', duration: 0.25 },
};

const SupportVideoContainer = ({ title, url }) => {
  const [isLoaded, setLoaded] = useBoolean(false);

  return (
    <SupportVideoContainerElement>
      <SupportVideo
        title={title}
        width="560"
        height="315"
        src={url}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={setLoaded}
      />
      <AnimatePresence>
        {!isLoaded && (
          <SupportVideoOverlay {...animationProperties}>
            <CubesLoader size={40} color="#007cab" />
          </SupportVideoOverlay>
        )}
      </AnimatePresence>
    </SupportVideoContainerElement>
  );
};

const SupportVideo = styled.iframe`
  background-color: #c4c4c4;
  min-height: 15rem;
  width: 100%;
`;

const videos = [
  {
    title: 'Creating Tasks in Dock Health (Triage Line Example)',
    url: 'https://www.youtube.com/embed/gNzPoCI3Dvw',
  },
  {
    title: 'Emailing a Task to Dock Health',
    url: 'https://www.youtube.com/embed/gBOn7cIgOUc',
  },
  {
    title: 'Adding Patients to Your Organization in Dock',
    url: 'https://www.youtube.com/embed/OZslD1Q1fcA',
  },
];

const SupportSectionViewVideos = () => (
  <>
    <Grid container alignItems="center" justify="space-between" item xs={12}>
      <Typography variant="h2">
        <b>HOW TO VIDEOS</b>
      </Typography>
      <div>
        <Grid container direction="row">
          <Typography variant="body1">
            <SupportViewLink href="mailto:support@dock.health?Subject=Dock%20Support">
              support@dock.health
            </SupportViewLink>
          </Typography>
          <Spacing horizontal={4} />
          <Typography variant="body1">
            <SupportViewLink href="tel:857-302-0441">
              857-302-0441
            </SupportViewLink>
          </Typography>
        </Grid>
      </div>
    </Grid>
    <Grid item xs={12}>
      <Spacing vertical={4} />
    </Grid>
    <SupportVideosContainer>
      {videos.map(({ title, url }) => (
        <div key={url}>
          <SupportVideoContainer title={title} url={url} />
          <Typography variant="body1">
            <b>{title}</b>
          </Typography>
        </div>
      ))}
    </SupportVideosContainer>
  </>
);

export default SupportSectionViewVideos;

import moment from 'moment';
import always from 'ramda/src/always';
import cond from 'ramda/src/cond';
import equals from 'ramda/src/equals';
import range from 'ramda/src/range';
import startsWith from 'ramda/src/startsWith';
import T from 'ramda/src/T';
import React, { useCallback, useState, useRef } from 'react';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import DownloadIcon from 'img/download.svg';
import {
  Crop as CropIcon,
  Refresh as ResetIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Edit as EditIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import {
  AttachmentPreviewAudio,
  AttachmentPreviewContent,
  AttachmentPreviewDialog,
  AttachmentPreviewFlexContainer,
  AttachmentPreviewHeader,
  AttachmentPreviewHeaderAnchor,
  AttachmentPreviewHeaderButton,
  AttachmentPreviewHeaderIconContainer,
  AttachmentPreviewHeaderLabel,
  AttachmentPreviewHeaderSection,
  AttachmentPreviewHeaderSmallLabel,
  AttachmentPreviewImage,
  StyledPdfDocument,
  StyledPdfPage,
  UnsupportedFileContainer,
  CropperContainer,
  CropperControlsContainer,
  CropperButton,
  SaveButton,
} from './styled';
import { useSelector, useDispatch } from 'react-redux';
import { createPatientAttachment } from '@/app/actions/patient-details-actions';
import { patientSelector } from '@/app/selectors/patient-details-selectors';

const PREVIEW_DISPLAY_TYPES = {
  AUDIO: 'AUDIO',
  IMAGE: 'IMAGE',
  PDF: 'PDF',
  VIDEO: 'VIDEO',
  UNSUPPORTED: 'UNSUPPORTED',
};

const AttachmentPreview = React.memo((props) => {
  const {
    attachment,
    attachmentsSources,
    hideAttachmentPreview,
    isAttachmentPreviewOpen,
    attachmentsLoading,
  } = props;

  const {
    attachmentIdentifier: currentAttachmentIdentifier,
    dateCreated,
    fileName,
    contentType: attachmentContentType,
  } = attachment || {};

  const [numberOfPdfPages, setNumberOfPdfPages] = useState(0);
  const [isCropperMode, setIsCropperMode] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropperReady, setIsCropperReady] = useState(false);
  const cropperRef = useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onPdfLoadSuccess = useCallback(({ numPages }) => {
    setNumberOfPdfPages(numPages);
  }, []);

  const handleCropperToggle = useCallback(() => {
    setIsCropperMode((prev) => !prev);
    setCroppedImage(null);
    setIsCropperReady(false);
  }, []);

  const handleCropperReady = useCallback(() => {
    console.log('Cropper is ready');
    setIsCropperReady(true);

    if (cropperRef.current) {
      const cropper = cropperRef.current;
      setTimeout(() => {
        try {
          const image = cropper.getImage();
          console.log('Image element:', image);

          if (image) {
            const { width, height } = image;

            cropper.setCoordinates({
              left: 0,
              top: 0,
              width,
              height,
            });
          }
        } catch (error) {
          console.error('Error setting full image coordinates:', error);
          try {
            const currentCoords = cropper.getCoordinates();
            if (currentCoords) {
              cropper.setCoordinates({
                left: 0,
                top: 0,
                width: currentCoords.width * 2, 
                height: currentCoords.height * 2,
              });
            }
          } catch (fallbackError) {
            // console.error('Fallback also failed:', fallbackError);
          }
        }
      }, 100);
    }
  }, []);

  const handleCrop = useCallback(() => {
    if (!isCropperReady) {
      return;
    }

    if (cropperRef.current) {
      try {
        const canvas = cropperRef.current.getCanvas();
        if (canvas) {
          const croppedDataUrl = canvas.toDataURL('image/png', 1.0);
          setCroppedImage(croppedDataUrl);
          setIsCropperMode(false);
        } else {
          const canvasWithOptions = cropperRef.current.getCanvas({
            width: 512,
            height: 512,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
          });
          if (canvasWithOptions) {
            const croppedDataUrl = canvasWithOptions.toDataURL(
              'image/png',
              1.0,
            );
            setCroppedImage(croppedDataUrl);
            setIsCropperMode(false);
          }
        }
      } catch (error) {
        console.error('Error getting canvas:', error);
      }
    } else {
      console.error('Cropper ref is null');
    }
  }, [isCropperReady]);

  const handleReset = useCallback(() => {
    setCroppedImage(null);
    if (cropperRef.current) {
      cropperRef.current.reset();
    }
  }, []);

  const handleRotateLeft = useCallback(() => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(-90);
    }
  }, []);

  const handleRotateRight = useCallback(() => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(90);
    }
  }, []);

  const dispatch = useDispatch();
  const patient = useSelector(patientSelector);
  const patientIdentifier = patient?.patientIdentifier;
  const [currentlyUploadedAttachment, setCurrentlyUploadedAttachment] =
    useState(null);

  const handleEditSave = useCallback(() => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      canvas.toBlob((blob) => {
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
        const uniqueFileName = `edited_${timestamp}.png`;

        const file = new File([blob], uniqueFileName, { type: 'image/png' });

        dispatch(
          createPatientAttachment(
            patientIdentifier,
            '',
            file,
            {},
            setCurrentlyUploadedAttachment,
            onAttachmentFileInputChange,
          ),
        );
      });
    }
  }, []);
  const onAttachmentFileInputChange = (files) => {
    hideAttachmentPreview();
  };

  const handleZoomIn = useCallback(() => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage(1.2);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage(0.8);
    }
  }, []);

  // const handleDownloadCropped = useCallback(() => {
  //   if (croppedImage) {
  //     const link = document.createElement('a');
  //     link.download = `cropped_${fileName || 'image.png'}`;
  //     link.href = croppedImage;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // }, [croppedImage, fileName]);

  const displayType = cond([
    [startsWith('audio/'), always(PREVIEW_DISPLAY_TYPES.AUDIO)],
    [startsWith('image/'), always(PREVIEW_DISPLAY_TYPES.IMAGE)],
    [startsWith('video/'), always(PREVIEW_DISPLAY_TYPES.VIDEO)],
    [equals('application/pdf'), always(PREVIEW_DISPLAY_TYPES.PDF)],
    [T, always(PREVIEW_DISPLAY_TYPES.UNSUPPORTED)],
  ])(attachmentContentType || '');

  const attachmentSource = attachmentsSources.find(
    ({ attachmentIdentifier }) =>
      attachmentIdentifier === currentAttachmentIdentifier,
  );
  const fileSource = attachmentSource?.fileSource;

  const formattedDateCreated = dateCreated
    ? moment(dateCreated).format('MMM D, YYYY [at] h:mma')
    : '';

  return (
    <AttachmentPreviewDialog
      open={isAttachmentPreviewOpen && !attachmentsLoading}
      onClose={hideAttachmentPreview}
      fullWidth
    >
      <AttachmentPreviewHeader>
        <AttachmentPreviewHeaderSection
          direction="column"
          alignItems="flex-start"
        >
          <AttachmentPreviewHeaderLabel>
            {fileName}
          </AttachmentPreviewHeaderLabel>
          <AttachmentPreviewHeaderSmallLabel>
            {formattedDateCreated}
          </AttachmentPreviewHeaderSmallLabel>
        </AttachmentPreviewHeaderSection>
        <AttachmentPreviewHeaderSection
          direction="row"
          justify="center"
          alignItems="center"
          style={{ gap: '0.25rem' }}
        >
          {displayType === PREVIEW_DISPLAY_TYPES.IMAGE && (
            <>
              <CropperButton onClick={handleCropperToggle}>
                {!isCropperMode && (
                  <EditIcon
                    style={{ marginRight: '0.5rem', fontSize: '16px' }}
                  />
                )}
                {isCropperMode ? (
                  <>
                    <CancelIcon
                      style={{ marginRight: '0.4rem', fontSize: '16px' }}
                    />
                    Cancel
                  </>
                ) : (
                  'Edit'
                )}
              </CropperButton>
              {isCropperMode && (
                <SaveButton
                  style={{
                    marginLeft: '0.75rem',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={handleEditSave}
                >
                  <SaveIcon
                    style={{ marginRight: '0.4rem', fontSize: '16px' }}
                  />
                  Save
                </SaveButton>
              )}
              <div style={{ marginLeft: '1rem' }}>
                <AttachmentPreviewHeaderAnchor
                  download={fileName}
                  href={fileSource}
                >
                  <AttachmentPreviewHeaderIconContainer>
                    <img src={DownloadIcon} alt="Download" />
                  </AttachmentPreviewHeaderIconContainer>
                  <AttachmentPreviewHeaderLabel>
                    Download
                  </AttachmentPreviewHeaderLabel>
                </AttachmentPreviewHeaderAnchor>
              </div>
            </>
          )}
        </AttachmentPreviewHeaderSection>
        <AttachmentPreviewHeaderSection direction="row" justify="flex-end">
          <AttachmentPreviewHeaderButton onClick={hideAttachmentPreview} big>
            &times;
          </AttachmentPreviewHeaderButton>
        </AttachmentPreviewHeaderSection>
      </AttachmentPreviewHeader>
      <AttachmentPreviewContent>
        {displayType === PREVIEW_DISPLAY_TYPES.IMAGE && (
          <>
            {isCropperMode && (
              <CropperControlsContainer>
                <CropperButton onClick={handleCrop} disabled={!isCropperReady}>
                  <CropIcon
                    style={{ marginRight: '0.2rem', fontSize: '16px' }}
                  />
                  Crop {!isCropperReady ? '(Loading...)' : ''}
                </CropperButton>
                <CropperButton onClick={handleReset}>
                  <ResetIcon
                    style={{ marginRight: '0.2rem', fontSize: '16px' }}
                  />
                  Reset
                </CropperButton>
                <CropperButton onClick={handleRotateLeft}>
                  <RotateLeftIcon
                    style={{ marginRight: '0.2rem', fontSize: '16px' }}
                  />
                  Rotate Left
                </CropperButton>
                <CropperButton onClick={handleRotateRight}>
                  <RotateRightIcon
                    style={{ marginRight: '0.2rem', fontSize: '16px' }}
                  />
                  Rotate Right
                </CropperButton>
                <CropperButton onClick={handleZoomIn}>
                  <ZoomInIcon
                    style={{ marginRight: '0.2rem', fontSize: '16px' }}
                  />
                  Zoom In
                </CropperButton>
                <CropperButton onClick={handleZoomOut}>
                  <ZoomOutIcon
                    style={{ marginRight: '0.2rem', fontSize: '16px' }}
                  />
                  Zoom Out
                </CropperButton>
              </CropperControlsContainer>
            )}
            {isCropperMode ? (
              <CropperContainer>
                <Cropper
                  ref={cropperRef}
                  src={fileSource}
                  style={{ height: '400px', width: '100%' }}
                  backgroundWrapperProps={{
                    scaleImage: true,
                    moveImage: true,
                  }}
                  checkOrientation={false}
                  transitions={true}
                  onReady={handleCropperReady}
                />
              </CropperContainer>
            ) : (
              <>
                <AttachmentPreviewFlexContainer>
                  <AttachmentPreviewImage
                    alt="Attachment"
                    src={croppedImage || fileSource}
                    onLoad={() =>
                      console.log(
                        'Image loaded:',
                        croppedImage ? 'cropped' : 'original',
                      )
                    }
                  />
                </AttachmentPreviewFlexContainer>
                {/* {croppedImage && (
                  <CropperControlsContainer>
                    <CropperButton onClick={handleDownloadCropped}>
                      Download Cropped Image
                    </CropperButton>
                  </CropperControlsContainer>
                )} */}
              </>
            )}
          </>
        )}
        {displayType === PREVIEW_DISPLAY_TYPES.AUDIO && (
          <AttachmentPreviewFlexContainer>
            <AttachmentPreviewAudio controls src={fileSource} />
          </AttachmentPreviewFlexContainer>
        )}
        {displayType === PREVIEW_DISPLAY_TYPES.PDF && (
          <StyledPdfDocument file={fileSource} onLoadSuccess={onPdfLoadSuccess}>
            {range(0, numberOfPdfPages).map((pageIndex) => (
              <StyledPdfPage
                key={pageIndex}
                pageNumber={pageIndex + 1}
                scale={1.5}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </StyledPdfDocument>
        )}
        {displayType === PREVIEW_DISPLAY_TYPES.UNSUPPORTED && (
          <UnsupportedFileContainer>
            Preview is not available for this file.
          </UnsupportedFileContainer>
        )}
      </AttachmentPreviewContent>
    </AttachmentPreviewDialog>
  );
});

export default AttachmentPreview;

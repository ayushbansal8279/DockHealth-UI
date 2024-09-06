export const featureSelector = (
  organizationAvailableFeatures,
  userAvailableFeatures,
  feature,
) => {
  return (
    (!!organizationAvailableFeatures &&
      organizationAvailableFeatures?.includes(feature)) ||
    (!!userAvailableFeatures && userAvailableFeatures?.includes(feature))
  );
};

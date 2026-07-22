const createImageAsset = ({ key, fallbackPath, width, height }) =>
  Object.freeze({ key, fallbackPath, width, height });

export const MODERN_IMAGE_FORMATS = Object.freeze([
  Object.freeze({ extension: "avif", mimeType: "image/avif" }),
  Object.freeze({ extension: "webp", mimeType: "image/webp" }),
]);

export const CONTENT_IMAGE_ASSETS = Object.freeze([
  createImageAsset({
    key: "homepage-hero",
    fallbackPath: "/assets/img/hero/hero-01.jpg",
    width: 1600,
    height: 1200,
  }),
  createImageAsset({
    key: "contact-hero",
    fallbackPath: "/assets/img/hero/hero-08.jpg",
    width: 1600,
    height: 1200,
  }),
  createImageAsset({
    key: "about-portrait",
    fallbackPath: "/assets/img/about/lauren.jpg",
    width: 420,
    height: 480,
  }),
]);

export const getModernImagePath = (fallbackPath, extension) =>
  fallbackPath.replace(/\.(?:jpe?g|png)$/i, `.${extension}`);

export const getImagePaths = ({ fallbackPath }) => [
  fallbackPath,
  ...MODERN_IMAGE_FORMATS.map(({ extension }) =>
    getModernImagePath(fallbackPath, extension),
  ),
];

export const CONTENT_IMAGE_PATHS = Object.freeze(
  CONTENT_IMAGE_ASSETS.flatMap(getImagePaths),
);

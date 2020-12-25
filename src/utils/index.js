export const isIOS = () => {
  const ua = navigator.userAgent;
  return Boolean(ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/));
};

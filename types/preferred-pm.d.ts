declare module 'preferred-pm' {
  function preferredPM(
    pkgPath: string,
  ): Promise<null | { name: string; version: string }>;

  export default preferredPM;
}

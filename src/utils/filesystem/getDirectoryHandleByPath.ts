export const getDirectoryHandleByPath = async (
  path: string,
  baseDirectory: FileSystemDirectoryHandle,
  options?: FileSystemGetDirectoryOptions,
): Promise<FileSystemDirectoryHandle> => {
  const names: string[] = [];
  const restNames = path.split("/");

  const nextName = () => {
    const name = restNames.shift()!;
    restNames.push(name);
    return name;
  };

  try {
    let subDirectory = baseDirectory;
    while (restNames.length > 0) {
      const name = nextName();
      subDirectory = await subDirectory.getDirectoryHandle(name, options);
    }
    return subDirectory;
  } catch (cause) {
    throw new Error(`Failed to get directory: ${names.join("/")}`, { cause });
  }
};

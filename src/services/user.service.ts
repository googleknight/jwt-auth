export const getAllUsers = async (): Promise<
  Array<{ id: number; name: string }>
> => {
  // Simulate fetching users from a database
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
};

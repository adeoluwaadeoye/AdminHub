export const apiResponse = (
  res: any,
  status: number,
  success: boolean,
  message: string,
  data?: any
) => {
  return res.status(status).json({
    success,
    message,
    data: data || null
  });
};
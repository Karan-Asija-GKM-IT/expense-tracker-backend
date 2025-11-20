export const handleServiceError = (error, defaultMessage) => {
  console.error("Service Error:", error);

  
  if (error instanceof Error && error.message) {
    throw new Error(error.message);
  }


  throw new Error(defaultMessage);
};

import Swal from 'sweetalert2';

//category
export const confirmDeletion = async (message: string): Promise<boolean> => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  return result.isConfirmed;
};

//block and unblock
export const showConfirmationDialog = async (title: string, text: string, confirmButtonText: string) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText,
      cancelButtonText: 'Cancel',
    });
  
    return result.isConfirmed;
  };


// user unblock block
/**
 * Shows a confirmation alert.
 * @param action The action the user is confirming (e.g., "block", "unblock").
 * @returns A promise that resolves to true if confirmed, or false if canceled.
 */
export const showConfirmationAlert = async (action: string): Promise<boolean> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: 'Cancel',
    });
  
    return result.isConfirmed;
  };
  
  /**
   * Shows a success alert.
   * @param message The success message to display.
   */
  export const showSuccessAlert = (message: string): void => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  };
  
  /**
   * Shows an error alert.
   * @param message The error message to display.
   */
  export const showErrorAlert = (message: string): void => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  };
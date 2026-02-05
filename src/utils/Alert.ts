import Swal, { SweetAlertIcon } from 'sweetalert2';

interface AlertOptions {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  timer?: number;
}

export const showAlert = ({
  title,
  text = '',
  icon = 'success',
  timer = 2000
}: AlertOptions) => {
  return Swal.fire({
    title,
    text,
    icon,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    toast: true,
    position: 'top-end'
  });
};

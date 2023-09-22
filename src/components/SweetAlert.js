import swal from 'sweetalert';

const SweetAlert = ({ type, message }) => {
  if (type === 'success') {
    swal({
      title: 'Succès',
      text: message,
      icon: 'success',
      dangerMode: false,
    });
  } else if (type === 'warning') {
    swal({
      title: 'Warning',
      text: message,
      icon: 'warning',
      dangerMode: true,
    });
  } else if (type === 'error') {
    swal({
      title: 'Erreur',
      text: message,
      icon: 'error',
      dangerMode: true,
    });
  }
};

export default SweetAlert;

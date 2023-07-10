import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// create a component
const ToastComponent = ({ message, type }) => {
    toast(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        type: type
        // Other options...
    });

};

// make this component available to the app
export default ToastComponent;
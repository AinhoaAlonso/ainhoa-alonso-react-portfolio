import { library } from '@fortawesome/fontawesome-svg-core';

//Ahora seleccionamos los iconos reales que queremos traer a la aplicación
import { 
    faSignOut, 
    faSignOutAlt, 
    faTrash, 
    faRightFromBracket,
    faPenToSquare,
    faSpinner, 
    faCirclePlus 
} from '@fortawesome/free-solid-svg-icons';

//Ahora necesitamos conectar este componente de la biblioteca y decirle cuál de los componentes vamos a extraer, o qué íconos vamos a extraer.
//lo hacemos con una variable que luego vamos a exportar

const Icons = () =>{
    return library.add(faSignOut, faSignOutAlt, faTrash, faRightFromBracket, faPenToSquare, faSpinner, faCirclePlus);
};

export default Icons;
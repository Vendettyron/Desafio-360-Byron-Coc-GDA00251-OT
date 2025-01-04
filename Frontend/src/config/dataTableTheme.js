import { createTheme } from 'react-data-table-component';

/**
 * Configura un tema personalizado para react-data-table-component.
 */
const configureCustomTheme = () => {
    const themeName = 'custom';

    // Crea el tema personalizado
    createTheme(
        themeName,
        {
            text: {
                primary: 'rgb(0,0,0)',
                secondary: 'rgb(0,0,0)',
            },
            background: {
                default: 'rgb(228,228,231)',
            },
            context: {
                background: 'rgb(228,228,231)',
                text: 'rgb(228,228,231)',
            },
            divider: {
                default: '#073642',
            },
            button: {
                default: 'rgb(63,72,204)',
                hover: 'rgb(155,155,155)',
                focus: 'rgb(255,255,255)',
                disabled: 'rgb(150,155,155)',
            },
            sortFocus: {
                default: 'rgb(228,228,231)',
            },
        },
        'light' // Modo del tema
    );
};

export default configureCustomTheme;

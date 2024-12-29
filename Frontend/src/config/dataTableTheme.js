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
                primary: '#268bd2',
                secondary: '#2aa198',
            },
            background: {
                default: '#f5f5f5',
            },
            context: {
                background: '#cb4b16',
                text: '#FFFFFF',
            },
            divider: {
                default: '#073642',
            },
            button: {
                default: '#2aa198',
                hover: 'rgba(0,0,0,.08)',
                focus: 'rgba(255,255,255,.12)',
                disabled: 'rgba(255, 255, 255, .34)',
            },
            sortFocus: {
                default: '#2aa198',
            },
        },
        'light' // Modo del tema
    );
};

export default configureCustomTheme;

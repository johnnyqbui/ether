export const Colors = {
    light: {
        background: '#FFFFFF',
        cardBackground: '#F8F9FA',
        text: '#212529',
        primary: '#0d6efd',
        secondary: '#6c757d',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0',
        border: '#dee2e6',
        placeholder: '#6c757d'
    },
    dark: {
        background: '#121212',
        cardBackground: '#1E1E1E',
        text: '#E0E0E0',
        primary: '#0d6efd',
        secondary: '#6c757d',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0',
        border: '#2d2d2d',
        placeholder: '#6c757d'
    }
};

export type ColorScheme = keyof typeof Colors;

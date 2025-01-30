import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export const useColorScheme = (): NonNullable<ColorSchemeName> => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme() || 'light');

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setColorScheme(colorScheme || 'light');
        });

        return () => subscription.remove();
    }, []);

    return colorScheme;
};
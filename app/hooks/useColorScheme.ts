import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export const useColorScheme = (): ColorSchemeName => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setColorScheme(colorScheme);
        });

        return () => subscription.remove();
    }, []);

    return colorScheme;
};

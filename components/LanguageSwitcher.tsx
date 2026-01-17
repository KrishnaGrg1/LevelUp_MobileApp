import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import LanguageStore, { Language } from '@/stores/language.store';
import { useTranslation } from '@/translation';
import { Check, Languages } from 'lucide-react-native';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
const languages = [
  { code: 'eng' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'nep' as Language, name: 'नेपाली', flag: '🇳🇵' },
  { code: 'arab' as Language, name: 'العربية', flag: '🇸🇦' },
  { code: 'chin' as Language, name: '中文', flag: '🇨🇳' },
  { code: 'span' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'jap' as Language, name: '日本語', flag: '🇯🇵' },
];

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, setLanguage } = LanguageStore(
    useShallow(state => ({
      language: state.language,
      setLanguage: state.setLanguage,
    })),
  );

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const changeLanguage = (languageCode: Language) => {
    setLanguage(languageCode);
    console.log('Language changed to:', languageCode, language);
  };

  return (
    <Menu
      placement="bottom"
      offset={5}
      trigger={({ ...triggerProps }) => {
        return (
          <Pressable
            {...triggerProps}
            className="flex-row items-center justify-center rounded-full border border-outline-200 bg-background-50 px-3 py-2"
          >
            <Box className="flex-row items-center gap-1">
              <Icon as={Languages} size="sm" className="text-typography-600" />
              <Text size="sm">{currentLanguage.flag}</Text>
              <Text size="xs" className="ml-1 font-medium text-typography-600">
                {currentLanguage.code.toUpperCase()}
              </Text>
            </Box>
          </Pressable>
        );
      }}
    >
      {languages.map(lang => {
        const isActive = language === lang.code;
        return (
          <MenuItem key={lang.code} textValue={lang.name} onPress={() => changeLanguage(lang.code)}>
            <Box className="min-w-[200px] flex-row items-center justify-between">
              <Box className="flex-row items-center gap-2">
                <Text size="lg">{lang.flag}</Text>
                <MenuItemLabel size="sm" className={isActive ? 'font-semibold' : ''}>
                  {lang.name}
                </MenuItemLabel>
              </Box>
              {isActive && <Icon as={Check} size="sm" className="text-primary-500" />}
            </Box>
          </MenuItem>
        );
      })}
    </Menu>
  );
}

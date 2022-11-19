/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import {
  RadioButton,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';

type Language = {
  name: string;
  code: string;
}

type Props = {
  languages: Language[];
  onSelectLanguage: (lang: Language) => void;
  defaultLangCode: Language;
};

export const LanguageSelect = (props: Props) => {
  const { languages, onSelectLanguage, defaultLangCode } = props;
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [checked, setChecked] = useState(defaultLangCode);
  useEffect(() => {
    setChecked(defaultLangCode);
  }, [defaultLangCode])
  const selectLanguage = (lang: Language) => {
    setChecked(lang);
    onSelectLanguage(lang);
  };
  return (
    <>
      <Button onPress={showDialog}>{checked.name}</Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{t('language')}</Dialog.Title>
          <Dialog.Content>
            {languages.map((langObj) => (
              <View
                key={langObj.code}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <RadioButton
                  value={langObj.code}
                  status={checked.code === langObj.code ? 'checked' : 'unchecked'}
                  onPress={() => selectLanguage(langObj)}
                />
                <Text style={{ fontSize: 18 }}>{langObj.name}</Text>
              </View>
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

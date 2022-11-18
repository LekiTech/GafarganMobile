/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
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
  onSelectLanguage: (langCode: string) => void;
  defaultLangCode: string;
};
// [
//               { name: 'Lezgi', value: 'lez' },
//               { name: 'Russian', value: 'rus' },
//               { name: 'Tabasaran', value: 'tab' },
//             ]
export const LanguageSelect = (props: Props) => {
  const { languages, onSelectLanguage, defaultLangCode } = props;
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [checked, setChecked] = React.useState(defaultLangCode);
  const selectLanguage = (langCode: string) => {
    setChecked(langCode);
    onSelectLanguage(langCode);
  };
  return (
    <>
      <Button onPress={showDialog}>{checked}</Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
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
                  status={checked === langObj.code ? 'checked' : 'unchecked'}
                  onPress={() => selectLanguage(langObj.code)}
                />
                <Text style={{ fontSize: 18 }}>{langObj.name}</Text>
              </View>
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

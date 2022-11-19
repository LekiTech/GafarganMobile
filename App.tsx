import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as RNLocalize from 'react-native-localize';
import './src/locales/i18n';

import { Dictionary } from './src/components/Dictionary';
import { Language } from './src/enums';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { t, i18n } = useTranslation();
  const [foundAppLang, setFoundAppLang] = useState(false);
  useEffect(() => {
    if (!foundAppLang) {
      const deviceLang = //Language.LEZGI;
        RNLocalize.getLocales()[0].languageCode === 'ru' ? Language.RUSSIAN : Language.ENGLISH;
      i18n.changeLanguage(deviceLang);
      console.log(t('meta.title'));
      setFoundAppLang(true);
    }
  }, [i18n, t, foundAppLang]);
  // const backgroundStyle = {
  //   flex: 1,
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#383b42' : '#fff'} //{backgroundStyle.backgroundColor}
      />
      <PaperProvider>
        {foundAppLang ? (
          <Dictionary />
        ) : (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </PaperProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;

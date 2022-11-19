/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, Platform, FlatList } from 'react-native';
import { SearchBar } from './SearchBar';
import { LanguageSelect } from './LanguageSelect';
import { Language } from '../enums';
import { useTranslation } from 'react-i18next';
import { FormattedDefinitionText } from './FormattedDefinitionText';

const renderItem = ({ item }, searchText: string) => (
  <View
    style={{
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 10,
      marginHorizontal: 20,
      backgroundColor: '#fff',
    }}
  >
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      }}
    >
      <Text style={{ fontSize: 22, color: '#0D4949', fontWeight: 'bold' }}>{item.spelling}</Text>
      {item.inflection && (
        <Text
          style={{
            fontSize: 16,
            marginLeft: 10,
            color: '#0D4949',
            fontWeight: 'bold',
            paddingBottom: 3,
          }}
        >
          ({item.inflection})
        </Text>
      )}
    </View>
    <View style={{ marginVertical: 10, flexDirection: 'column' }}>
      {item.definitions.map((def) => (
        <FormattedDefinitionText
          definition={def.text}
          fromLang={def.fromLang}
          toLang={def.toLang}
        />
      ))}
    </View>
  </View>
);

export const SupportedLanguages: Record<string, string[]> = {
  [Language.LEZGI]: [Language.RUSSIAN],
  [Language.TABASARAN]: [Language.RUSSIAN],
  [Language.RUSSIAN]: [Language.LEZGI, Language.TABASARAN],
};

export const Dictionary = () => {
  const { t } = useTranslation();
  const [resultsList, setResultsList] = useState(undefined);
  // const [selectedItem, setSelectedItem] = useState(undefined as unknown as undefined | string);
  const fromLanguages = Object.keys(SupportedLanguages).map((lang) => ({
    name: t(`languages.${lang}`),
    code: lang,
  }));
  const [fromLang, setFromLang] = useState(fromLanguages[0]);
  const [toLanguages, setToLanguages] = useState(
    SupportedLanguages[fromLang.code].map((lang) => ({ name: t(`languages.${lang}`), code: lang })),
  );
  const [toLang, setToLang] = useState(toLanguages[0]);
  const [searchText, setSearchText] = useState('');
  const performSearch = useCallback(async () => {
    if (searchText != null && searchText.length > 0) {
      const response = await fetch(
        `https://api.gafalag.com/expression/search?exp=${searchText}&fromLang=${fromLang.code}&toLang=${toLang.code}`,
      );
      setResultsList(await response.json());
    }
  }, [fromLang.code, searchText, toLang.code]);
  useEffect(() => {
    setToLanguages(
      SupportedLanguages[fromLang.code].map((lang) => ({
        name: t(`languages.${lang}`),
        code: lang,
      })),
    );
  }, [t, fromLang]);
  useEffect(() => {
    setToLang(toLanguages[0]);
    performSearch();
  }, [performSearch, fromLang, toLanguages]);
  useEffect(() => {
    performSearch();
  }, [performSearch, searchText]);

  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
      <View
        style={[
          { marginTop: 10, marginBottom: 0, flexDirection: 'row', alignItems: 'center' },
          Platform.select({ ios: { zIndex: 1 } }),
        ]}
      >
        <SearchBar
          fromLang={fromLang.code}
          toLang={toLang.code}
          onSelectItem={async (item) => {
            if (item) {
              setSearchText(item.title ?? '');
              // setSelectedItem(item.title ?? undefined);
              // const response = await fetch(
              //   `https://api.gafalag.com/expression/search?exp=${item.title}&fromLang=${fromLang.code}&toLang=${toLang.code}`,
              // );
              // setResultsList(await response.json());
            }
          }}
        />
      </View>
      <FlatList
        data={resultsList}
        renderItem={(item) => renderItem(item, searchText)}
        keyExtractor={(item) => item.id}
        // ListFooterComponent={

        // }
      />
      <View
        style={{
          // flex: 1,
          flexDirection: 'column',
          backgroundColor: '#fff',
          marginTop: -1,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <LanguageSelect
            languages={fromLanguages}
            defaultLangCode={fromLang}
            onSelectLanguage={setFromLang}
          />
          <LanguageSelect
            languages={toLanguages}
            defaultLangCode={toLang}
            onSelectLanguage={setToLang}
          />
        </View>
      </View>
    </View>
  );
};

/* eslint-disable react-native/no-inline-styles */
import React, { memo, useRef, useState } from 'react';
import { Text, View, Platform, FlatList } from 'react-native';
import {
  RadioButton,
  Portal,
  Dialog,
  Menu,
  Divider,
  Button,
  SegmentedButtons,
} from 'react-native-paper';
import { SearchBar } from './SearchBar';
import Feather from 'react-native-vector-icons/Feather';
import { LanguageSelect } from './LanguageSelect';
// Feather.loadFont();

const renderItem = ({ item }) => (
  <View
    style={{
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 10,
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
      <Text style={{ fontSize: 21 }}>{item.spelling}</Text>
      {item.inflection && <Text style={{ fontSize: 16, marginLeft: 10 }}>({item.inflection})</Text>}
    </View>
    <Text style={{ marginBottom: 5 }}>{item.definitions.map((def) => def.text).join('\n')}</Text>
  </View>
);

const languages = [
  { name: 'Lezgi', code: 'lez' },
  { name: 'Russian', code: 'rus' },
  { name: 'Tabasaran', code: 'tab' },
];

export const RemoteDataSetExample = memo(() => {
  const [resultsList, setResultsList] = useState(undefined);
  // const [selectedItem, setSelectedItem] = useState(undefined as unknown as undefined | string);
  const [fromLang, setFromLang] = React.useState('lez');
  const [toLang, setToLang] = React.useState('rus');

  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
      <View
        style={[
          { marginTop: 10, marginBottom: 0, flexDirection: 'row', alignItems: 'center' },
          Platform.select({ ios: { zIndex: 1 } }),
        ]}
      >
        <SearchBar
          onSelectItem={async (item) => {
            if (item) {
              // setSelectedItem(item.title ?? undefined);
              const response = await fetch(
                `https://api.gafalag.com/expression/search?exp=${item.title}&fromLang=${fromLang}&toLang=${toLang}`,
              );
              setResultsList(await response.json());
            }
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: '#fff',
          marginTop: -1,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <LanguageSelect
            languages={languages}
            defaultLangCode={fromLang}
            onSelectLanguage={setFromLang}
          />
          <LanguageSelect
            languages={languages}
            defaultLangCode={toLang}
            onSelectLanguage={setToLang}
          />
        </View>
        <FlatList data={resultsList} renderItem={renderItem} keyExtractor={(item) => item.id} />
      </View>
    </View>
  );
});

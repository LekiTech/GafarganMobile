/* eslint-disable react-native/no-inline-styles */
import React, { memo, useCallback, useRef, useState } from 'react';
import { Dimensions, Text, Platform } from 'react-native';
import {
  AutocompleteDropdown,
  AutocompleteDropdownRef,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';

type Props = {
  onSelectItem: ((item: TAutocompleteDropdownItem) => void) | undefined;
};

export const SearchBar = memo((props: Props) => {
  const { onSelectItem } = props;
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(undefined);
  const dropdownController = useRef(null as unknown as AutocompleteDropdownRef);

  const searchRef = useRef(null);

  const getSuggestions = useCallback(async (q: string) => {
    const filterToken = q.toLowerCase();
    console.log('getSuggestions', q);
    if (typeof q !== 'string') {
      setSuggestionsList(undefined);
      return;
    }
    setLoading(true);
    const response = await fetch(
      `https://api.gafalag.com/expression/search/suggestions?exp=${filterToken}&fromLang=lez&toLang=rus`,
    );
    const suggestions = await response.json();
    setSuggestionsList(suggestions.map((word, i) => ({ id: i, title: word })));
    setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(undefined);
  }, []);

  const onOpenSuggestionsList = useCallback((_isOpened: any) => {}, []);

  return (
    <AutocompleteDropdown
      // @ts-ignore
      ref={searchRef}
      controller={(controller) => {
        dropdownController.current = controller;
      }}
      direction={Platform.select({ ios: 'down' })}
      dataSet={suggestionsList}
      onChangeText={getSuggestions}
      onSelectItem={onSelectItem}
      //   async (item) => {
      //   if (item) {
      //     setSelectedItem(item.title);
      //     const response = await fetch(
      //       `https://api.gafalag.com/expression/search?exp=${item.title}&fromLang=lez&toLang=rus`,
      //     );
      //     setResultsList(await response.json());
      //   }
      // }}
      debounce={600}
      suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
      onClear={onClearPress}
      //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
      onOpenSuggestionsList={onOpenSuggestionsList}
      loading={loading}
      useFilter={false} // set false to prevent rerender twice
      textInputProps={{
        placeholder: 'Жагъурун ...',
        autoCorrect: false,
        autoCapitalize: 'none',
        style: {
          backgroundColor: '#fff',
          color: '#383b42',
          paddingLeft: 18,
        },
      }}
      rightButtonsContainerStyle={{
        right: 8,
        height: 30,
        alignSelf: 'center',
      }}
      inputContainerStyle={{ backgroundColor: '#fff' }}
      suggestionsListContainerStyle={{
        backgroundColor: '#fff',
      }}
      containerStyle={{ flexGrow: 1, flexShrink: 1 }}
      renderItem={(item, _text) => (
        <Text style={{ color: '#383b42', padding: 15 }}>{item.title}</Text>
      )}
      inputHeight={50}
      showChevron={false}
      closeOnBlur={false}
    />
  );
});

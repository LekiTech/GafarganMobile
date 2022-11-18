import React, { memo, useCallback, useRef, useState } from 'react';
import { Dimensions, Text, View, Platform, FlatList } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownRef } from 'react-native-autocomplete-dropdown';
import { Provider, Menu, Divider, Button, SegmentedButtons } from 'react-native-paper';

// import Feather from 'react-native-vector-icons/Feather';
// Feather.loadFont();

const renderItem = ({ item }) => (
  <View style={{borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10, backgroundColor: '#fff'}}>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
      <Text style={{fontSize: 21}}>{item.spelling}</Text>
      {item.inflection && <Text style={{fontSize: 16, marginLeft: 10}}>({item.inflection})</Text>}
    </View>
    <Text style={{marginBottom: 5}}>{item.definitions.map(def => def.text).join('\n')}</Text>
  </View>
);

export const RemoteDataSetExample = memo(() => {
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(undefined);
  const [resultsList, setResultsList] = useState(undefined);
  const [selectedItem, setSelectedItem] = useState(undefined as unknown as undefined | string);
  const dropdownController = useRef(null as unknown as AutocompleteDropdownRef);

  const searchRef = useRef(null);
  const langInputRef = useRef(null);

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
    // const items = await response.json();
    // const suggestions = items
    //   // .filter((item: { title: string }) => item.title.toLowerCase().includes(filterToken))
    //   .map((item: { id: any; spelling: any }) => ({
    //     id: item.id,
    //     title: item.spelling,
    //   }));
    // setSuggestionsList(suggestions);
    const suggestions = await response.json();
    setSuggestionsList(suggestions.map((word, i) => ({ id: i, title: word })));
    setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(undefined);
  }, []);

  const onOpenSuggestionsList = useCallback((_isOpened: any) => {}, []);

  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }}>
      <View
        style={[
          { marginTop: 10, marginBottom: 0, flexDirection: 'row', alignItems: 'center' },
          Platform.select({ ios: { zIndex: 1 } }),
        ]}
      >
        <AutocompleteDropdown
          // @ts-ignore
          ref={searchRef}
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          // initialValue={'1'}
          direction={Platform.select({ ios: 'down' })}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={async (item) => {
            if (item) {
              setSelectedItem(item.title);
              const response = await fetch(
                `https://api.gafalag.com/expression/search?exp=${item.title}&fromLang=lez&toLang=rus`,
              );
              setResultsList(await response.json());
            }
          }}
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
              // borderRadius: 25,
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
          inputContainerStyle={{
            backgroundColor: '#fff',
            // borderRadius: 25,
          }}
          suggestionsListContainerStyle={{
            backgroundColor: '#fff',
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item, _text) => (
            <Text style={{ color: '#383b42', padding: 15 }}>{item.title}</Text>
          )}
          // ChevronIconComponent={
          //   <Feather name="chevron-down" size={20} color="#fff" />
          // }
          // ClearIconComponent={
          //   <Feather name="x-circle" size={18} color="#fff" />
          // }
          inputHeight={50}
          showChevron={false}
          closeOnBlur={false}
          //  showClear={false}
        />
        {/* <View style={{ width: 10 }} /> */}
      </View>
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff', marginTop: -1, paddingVertical: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          {/* <Provider>
            <Menu
              visible={true}
              onDismiss={() => {}}
              anchor={<Button onPress={() => {}}>Lezgi</Button>}
            >
              <Menu.Item onPress={() => {}} title="Lezgi" />
              <Menu.Item onPress={() => {}} title="Russian" />
              <Divider />
              <Menu.Item onPress={() => {}} title="Tabasaran" />
            </Menu>
          </Provider> */}
          <SegmentedButtons
            value={'lr'}
            onValueChange={() => {}}
            buttons={[
              {
                value: 'lr',
                label: 'Lezgi -> Russian',
              },
              {
                value: 'rl',
                label: 'Russian -> Lezgi',
              },
            ]}
            // style={styles.group}
          />
        </View>
        {/* <Text style={{ color: '#000', fontSize: 13 }}>
          Selected item id:
          {JSON.stringify(resultsList)}
        </Text> */}
        <FlatList data={resultsList} renderItem={renderItem} keyExtractor={(item) => item.id} />
      </View>
    </View>
  );
});

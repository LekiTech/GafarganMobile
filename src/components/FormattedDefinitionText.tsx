/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { DefinitionTextType } from '../enums';

export type DefinitionTextObj = {
  text: string;
  type: DefinitionTextType;
};

const splitRegex = /({|}|<|>)/;

export function definitionToFormatJson(definition: string) {
  const result: DefinitionTextObj[] = [];
  const splitted = definition.split(splitRegex);

  let currDefType = DefinitionTextType.DESCRIPTION;
  let currDefText = '';
  for (const part of splitted) {
    switch (part) {
      case '{':
        currDefType = DefinitionTextType.EXAMPLE;
        break;
      case '<':
        currDefType = DefinitionTextType.TAG;
        break;
      case '}':
      case '>':
        result.push({ text: currDefText, type: currDefType });
        currDefType = DefinitionTextType.DESCRIPTION;
        currDefText = '';
        break;
      default:
        if (currDefType === DefinitionTextType.DESCRIPTION && part.length > 0) {
          result.push({ text: part, type: currDefType });
        } else {
          currDefText += part;
        }
    }
  }
  return result;
}

function highLightHtmlText(text: string, stringToHighlight?: string | null): string | JSX.Element {
  if (stringToHighlight === undefined || stringToHighlight === null) {
    return text;
  }
  // use regex for case insensitive replace and highlight
  const regex = new RegExp(`(${stringToHighlight})`, 'ig');
  return (
    <>
      {text
        .replace(regex, '__mark__$1__mark__')
        .split('__mark__')
        .map((str) =>
          regex.test(str) ? (
            <Text style={{ backgroundColor: 'yellow' }} key={`highlight_${str}_${Math.random()}`}>
              {str}
            </Text>
          ) : (
            str
          ),
        )}
    </>
  );
}

export function FormattedDefinitionText(props: {
  definition: string;
  fromLang: string;
  toLang: string;
  highlight?: string | null;
}) {
  const { definition, fromLang, toLang, highlight } = props;
  console.log('Highlight:', highlight);
  return (
    <Text style={{}}>
      {definitionToFormatJson(definition).map((textObj, i) => {
        const key = textObj.text + '_' + i + '_' + Math.random();
        switch (textObj.type) {
          case DefinitionTextType.TAG:
            return (
              <Text key={key} style={{ fontWeight: 'bold' }}>
                {highLightHtmlText(textObj.text, highlight)}
              </Text>
            );
          case DefinitionTextType.EXAMPLE:
            return (
              <Text
                key={key}
                style={{
                  fontStyle: 'italic',
                  color: '#0D4949',
                  textDecorationLine: 'underline',
                  // textDecorationStyle: 'dotted',
                  // textUnderlineOffset: '3px',
                  // cursor: 'pointer',
                }}
                // onClick={() => {}}
                // navigate({
                //   pathname: RoutesPaths.Search,
                //   search: `?${createSearchParams({
                //     expression: textObj.text,
                //     fromLang,
                //     toLang,
                //   })}`,
                // })
              >
                {highLightHtmlText(textObj.text, highlight)}
              </Text>
            );
          default:
            return <Text key={key}>{highLightHtmlText(textObj.text, highlight)}</Text>;
        }
      })}
    </Text>
  );
}

import React, { forwardRef } from "react";
import {
  ScrollView,
  FlatList,
  StyleProp,
  ViewStyle,
  Platform,
  FlatListProps,
} from "react-native";

interface ResponsiveListProps<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => JSX.Element;
  scrollViewProps?: {
    contentContainerStyle?: StyleProp<ViewStyle>;
    showsVerticalScrollIndicator?: boolean;
  };
}

type ResponsiveListRef = ScrollView | FlatList<any>;

const ResponsiveList = forwardRef<ResponsiveListRef, ResponsiveListProps<any>>(
  ({ data, keyExtractor, renderItem, scrollViewProps = {} }, ref) => {
    if (Platform.OS === "web") {
      return (
        <ScrollView
          ref={ref as React.RefObject<ScrollView>}
          contentContainerStyle={scrollViewProps.contentContainerStyle}
          showsVerticalScrollIndicator={
            scrollViewProps.showsVerticalScrollIndicator
          }
        >
          {data.map((item) => (
            <React.Fragment key={keyExtractor(item)}>
              {renderItem(item)}
            </React.Fragment>
          ))}
        </ScrollView>
      );
    } else {
      return (
        <FlatList
          ref={ref as React.RefObject<FlatList<any>>}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => renderItem(item)}
          contentContainerStyle={scrollViewProps.contentContainerStyle}
          showsVerticalScrollIndicator={
            scrollViewProps.showsVerticalScrollIndicator
          }
        />
      );
    }
  }
);

export default React.memo(ResponsiveList);

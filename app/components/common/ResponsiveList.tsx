// ResponsiveList.tsx
import React, {
  forwardRef,
  useCallback,
  memo,
  useMemo,
  Fragment,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  ScrollView,
  FlatList,
  Platform,
  View,
  Text,
  StyleProp,
  ViewStyle,
  ListRenderItem,
} from 'react-native';

/** Props for our ResponsiveList. */
interface ResponsiveListProps<T> {
  data: T[];
  /** Unique key extractor for each item. */
  keyExtractor: (item: T, index: number) => string;
  /** Render function for each item. */
  renderItem: (item: T, index: number) => JSX.Element;
  /** If no data, show this component. */
  ListEmptyComponent?: JSX.Element;
  /** Additional styles for the underlying ScrollView/FlatList. */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Whether to show vertical scroll bar. Default = true. */
  showsVerticalScrollIndicator?: boolean;
}

/**
 * Methods we want to expose from ResponsiveList
 * (so parent can scroll imperatively).
 */
export interface ResponsiveListHandle {
  scrollToOffset?: (params: { offset: number; animated?: boolean }) => void;
}

function BaseResponsiveList<T>(
  {
    data,
    keyExtractor,
    renderItem,
    ListEmptyComponent,
    contentContainerStyle,
    showsVerticalScrollIndicator = true,
  }: ResponsiveListProps<T>,
  ref: React.Ref<ResponsiveListHandle>,
) {
  // Internal ref to either a ScrollView or FlatList
  const scrollRef = useRef<ScrollView | FlatList<T>>(null);

  // Let parent components imperatively call scrollToOffset
  useImperativeHandle(ref, () => ({
    scrollToOffset: ({ offset, animated = true }) => {
      if (Platform.OS === 'web') {
        // On web, our ref is a ScrollView with .scrollTo
        (scrollRef.current as ScrollView)?.scrollTo({
          x: 0,
          y: offset,
          animated,
        });
      } else {
        // On native, our ref is a FlatList with .scrollToOffset
        (scrollRef.current as FlatList<T>)?.scrollToOffset({
          offset,
          animated,
        });
      }
    },
  }));

  // Memoize data length
  const dataLength = data.length;

  // Prepare a FlatList-friendly renderItem function
  const nativeRenderItem = useCallback<ListRenderItem<T>>(
    ({ item, index }) => renderItem(item, index),
    [renderItem],
  );

  // For web, we map over data to produce children
  const webChildren = useMemo(() => {
    return data.map((item, index) => (
      <Fragment key={keyExtractor(item, index)}>{renderItem(item, index)}</Fragment>
    ));
  }, [data, keyExtractor, renderItem]);

  // If no data and a ListEmptyComponent is provided...
  if (dataLength === 0 && ListEmptyComponent) {
    // Web scenario
    if (Platform.OS === 'web') {
      return (
        <ScrollView
          ref={scrollRef as React.RefObject<ScrollView>}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        >
          {ListEmptyComponent}
        </ScrollView>
      );
    }
    // Native scenario
    return (
      <FlatList
        ref={scrollRef as React.RefObject<FlatList<T>>}
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      />
    );
  }

  // For normal data rendering:
  if (Platform.OS === 'web') {
    // --- Web: ScrollView with children ---
    return (
      <ScrollView
        ref={scrollRef as React.RefObject<ScrollView>}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      >
        {webChildren}
      </ScrollView>
    );
  }

  // --- Native: FlatList ---
  return (
    <FlatList
      ref={scrollRef as React.RefObject<FlatList<T>>}
      data={data}
      renderItem={nativeRenderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    />
  );
}

/**
 * Export a memoized & forwardRef-wrapped version.
 * Now parent can do `listRef.current.scrollToOffset(...).`
 */
const ResponsiveList = memo(forwardRef(BaseResponsiveList)) as <T>(
  props: ResponsiveListProps<T> & { ref?: React.Ref<ResponsiveListHandle> },
) => JSX.Element;

export default ResponsiveList;

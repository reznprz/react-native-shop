import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import PrimaryImage from '../../components/PrimaryImage';
import { Food } from 'app/api/services/foodService';
import Header from './Header';
import CategoryBar from './CategoryBar';
import QrFoodList from './QrFoodList';
import ResponsiveList, { ResponsiveListHandle } from '../common/ResponsiveList';
import Notification from '../Notification';

interface QrFoodItemProps {
  subCategoryMap: Map<string, Food[]>;
}

const QrFoodItem: React.FC<QrFoodItemProps> = ({ subCategoryMap }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const scrollViewRef = useRef<ResponsiveListHandle | null>(null);
  const categoryRefs = useRef<{ [key: string]: number }>({});

  const subCategoryMapMemo = useMemo(() => {
    return subCategoryMap || new Map<string, Food[]>();
  }, [subCategoryMap]);

  const subCategoryName = useMemo(() => {
    return Array.from(subCategoryMapMemo.keys())[0] || '';
  }, [subCategoryMapMemo]);

  const filteredFoods = useMemo(() => {
    return subCategoryMapMemo.get(subCategoryName) || [];
  }, [subCategoryMapMemo, subCategoryName]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        filteredFoods
          .map((food) => food.categoryName)
          .filter((category): category is string => category != null),
      ),
    );
  }, [filteredFoods]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (subCategoryMapMemo.size === 0) {
      setErrorMessage('No data available for the selected category.');
    } else if (filteredFoods.length === 0) {
      setErrorMessage('No food items found in this category.');
    } else {
      setErrorMessage('');
    }
  }, [subCategoryMapMemo, filteredFoods]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const closeError = () => setErrorMessage('');

  const handleScrollToCategory = (category: string) => {
    const position = categoryRefs.current[category];
    if (position !== undefined && scrollViewRef.current?.scrollToOffset) {
      scrollViewRef.current.scrollToOffset({ offset: position, animated: true });
      setSelectedCategory(category);
    } else {
      Alert.alert('Category not found', 'Unable to scroll to the selected category.');
    }
  };

  // Capture the Y-offset positions of each category
  const onCategoryLayout = (category: string, event: any) => {
    const { y } = event.nativeEvent.layout;
    categoryRefs.current[category] = y;
  };

  return (
    <View style={styles.container}>
      <PrimaryImage
        src={require('../../../assets/shajhya.jpg')}
        alt="Shajhya"
        mobileHeight={175}
        desktopHeight={300}
        objectFit="cover"
      />
      <View style={styles.headerContainer}>
        <Header subCategoryName={subCategoryName} goBack={() => {}} />

        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          scrollToCategory={handleScrollToCategory}
        />
      </View>
      <ResponsiveList
        ref={scrollViewRef}
        data={filteredFoods}
        keyExtractor={(food) => food.id.toString()}
        renderItem={(food) => (
          <QrFoodList
            categories={categories}
            filteredFoods={filteredFoods}
            onCategoryLayout={onCategoryLayout}
          />
        )}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      />
      {errorMessage !== '' && (
        <Notification message={errorMessage} onClose={closeError} type={'error'} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Replace with your desired background color
    position: 'relative',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff', // Replace with your desired background color
    zIndex: 10,
  },
  scrollViewContent: {
    paddingTop: 400, // Adjust based on the height of PrimaryImage and Header
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default QrFoodItem;

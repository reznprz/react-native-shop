import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import ModalActionsButton from 'app/components/common/modal/ModalActionsButton';
import { Category } from 'app/api/services/foodService';

interface AddUpdateCategoryFormProps {
  category: Category | null;
  onSubmit: (newCat: Category) => void;
  onCancel: () => void;
}

export const AddUpdateCategoryForm: React.FC<AddUpdateCategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [categoryNameTwo, setCategoryNameTwo] = useState(category?.categoryNameTwo || '');

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const newCat: Category = {
      id: category?.id || 0,
      name: trimmedName,
      description: description.trim() || '',
      categoryNameTwo: categoryNameTwo.trim() || '',
      categoryIcon: '',
    };
    onSubmit(newCat);
  };

  return (
    <View className="flex-1 bg-white px-6 py-8">
      <Text className="text-2xl font-semibold text-gray-900 mb-6">Add New Category</Text>

      {/* Primary Name */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Category Name*</Text>
        <TextInput
          placeholder="e.g., Beverages"
          value={name}
          onChangeText={setName}
          className="h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm"
        />
      </View>

      {/* Description (optional) */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Description <Text className="text-gray-500">(optional)</Text>
        </Text>
        <TextInput
          placeholder="Brief description of this category"
          value={description}
          onChangeText={setDescription}
          multiline
          className="h-20 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm"
          textAlignVertical="top"
        />
      </View>

      {/* Secondary Name (optional) */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Secondary Category Name <Text className="text-gray-500">(optional)</Text>
        </Text>
        <TextInput
          placeholder="e.g., Hot Beverages"
          value={categoryNameTwo}
          onChangeText={setCategoryNameTwo}
          className="h-12 px-4 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 shadow-sm"
        />
      </View>

      {/* Actions */}
      <ModalActionsButton
        cancelProps={{
          title: 'Cancel',
          onPress: onCancel,
        }}
        actionProps={{
          title: 'Save Category',
          onPress: handleSave,
        }}
        containerStyle={{
          marginTop: 40,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 16,
          height: 50,
        }}
      />
    </View>
  );
};

export default AddUpdateCategoryForm;

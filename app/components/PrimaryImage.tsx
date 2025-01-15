import React from "react";
import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from "react-native";

interface PrimaryImageProps {
  src: ImageSourcePropType;
  alt?: string;
  mobileHeight?: number; // e.g., 175
  desktopHeight?: number; // e.g., 300
  objectFit?: "cover" | "contain"; // corresponds to resizeMode
}

const PrimaryImage: React.FC<PrimaryImageProps> = ({
  src,
  alt = "Image",
  mobileHeight = 175,
  desktopHeight = 300,
  objectFit = "cover",
}) => {
  const windowWidth = Dimensions.get("window").width;
  const isMobile = windowWidth < 768; // Example breakpoint

  const height = isMobile ? mobileHeight : desktopHeight;

  return (
    <View style={{ width: "100%", height }}>
      <Image
        source={src}
        accessibilityLabel={alt}
        style={[styles.image, { height, resizeMode: objectFit }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
  },
});

export default PrimaryImage;

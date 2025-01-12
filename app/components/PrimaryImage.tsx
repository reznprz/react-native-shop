import React from "react";
import { Image, View, StyleSheet, Dimensions } from "react-native";

interface PrimaryImageProps {
  src: string;
  alt?: string;
  mobileHeight?: string; // e.g., "175px"
  desktopHeight?: string; // e.g., "300px"
  objectFit?: "cover" | "contain"; // corresponds to resizeMode
}

const PrimaryImage: React.FC<PrimaryImageProps> = ({
  src,
  alt = "Image",
  mobileHeight = "175px",
  desktopHeight = "300px",
  objectFit = "cover",
}) => {
  const windowWidth = Dimensions.get("window").width;
  const isMobile = windowWidth < 768; // Example breakpoint

  const height = isMobile ? parseInt(mobileHeight) : parseInt(desktopHeight);

  return (
    <View style={{ width: "100%", height }}>
      <Image
        source={{ uri: src }}
        alt={alt} // Note: React Native doesn't support 'alt' directly; use accessibilityLabel
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

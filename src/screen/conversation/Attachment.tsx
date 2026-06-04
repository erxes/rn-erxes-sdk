/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getAttachmentUrl } from '../../utils/utils';
import AppContext from '../../context/Context';
import { BackIcon } from '../../components/Icons';
import { messengerTheme } from '../../theme';

const fullWidth = Dimensions.get('window');
const width = fullWidth.width / 2;
const previewSize = fullWidth.width;

const Attachment: React.FC<any> = ({ images }) => {
  const value = useContext(AppContext);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { subDomain } = value;
  if (!images || images.length === 0) {
    return null;
  }

  const renderImage = (
    mWidth: number | undefined,
    uri: string,
    index: number
  ) => {
    const url = getAttachmentUrl(uri, subDomain);
    return (
      <Pressable key={index} onPress={() => setPreviewUrl(url)}>
        <Image
          style={{
            // flex: 1,
            width: mWidth,
            height: mWidth,
            borderRadius: 6,
            backgroundColor: 'transparent',
            marginVertical: 8,
          }}
          source={{ uri: url }}
        />
      </Pressable>
    );
  };

  const renderPreview = () => (
    <Modal
      visible={!!previewUrl}
      transparent
      animationType="fade"
      onRequestClose={() => setPreviewUrl(null)}
    >
      <View style={styles.previewRoot}>
        <TouchableOpacity
          style={styles.previewBackButton}
          onPress={() => setPreviewUrl(null)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <BackIcon color={messengerTheme.colors.primaryForeground} size={20} />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.previewContent}
          maximumZoomScale={4}
          minimumZoomScale={1}
          centerContent
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {previewUrl ? (
            <Image
              source={{ uri: previewUrl }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );

  if (images.length === 1) {
    return (
      <>
        <View marginT-10>{renderImage(width, images[0].url, 0)}</View>
        {renderPreview()}
      </>
    );
  }

  if (images.length === 2) {
    return (
      <>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          {renderImage(width / 2 - 2, images[0].url, 0)}
          <View paddingL-8>{renderImage(width / 2 - 2, images[1].url, 1)}</View>
        </View>
        {renderPreview()}
      </>
    );
  }

  if (images.length === 3) {
    return (
      <>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          {renderImage(width / 3 - 2, images[0].url, 0)}
          <View paddingL-8>{renderImage(width / 3 - 2, images[1].url, 1)}</View>
          <View paddingL-8>{renderImage(width / 3 - 2, images[2].url, 2)}</View>
        </View>
        {renderPreview()}
      </>
    );
  }

  if (images.length === 4) {
    return (
      <>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: 10,
          }}
        >
          {renderImage(width / 3 - 2, images[0].url, 0)}
          <View paddingL-8>{renderImage(width / 3 - 2, images[1].url, 1)}</View>
          <View paddingL-8>{renderImage(width / 3 - 2, images[2].url, 2)}</View>
          <View paddingL-8>{renderImage(width / 3 - 2, images[3].url, 3)}</View>
        </View>
        {renderPreview()}
      </>
    );
  }

  return (
    <>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 10,
        }}
      >
        {renderImage(width / 3 - 2, images[0].url, 0)}
        <View style={{ paddingLeft: 8 }}>
          {renderImage(width / 3 - 2, images[1].url, 1)}
        </View>
        <View style={{ paddingLeft: 8 }}>
          {renderImage(width / 3 - 2, images[2].url, 2)}
        </View>
        <View style={{ paddingLeft: 8 }}>
          {renderImage(width / 3 - 2, images[3].url, 3)}
          <View
            style={{
              position: 'absolute',
              right: 0,
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: 'rgba(255,255,255,0.5)',
              marginLeft: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}
          >
            <Text style={{ color: '#686868', fontSize: 16, fontWeight: '500' }}>
              {'+ ' + `${images.length - 4}`}
            </Text>
          </View>
        </View>
      </View>
      {renderPreview()}
    </>
  );
};

export default Attachment;

const styles = {
  previewRoot: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewBackButton: {
    position: 'absolute' as const,
    top: 54,
    left: 18,
    zIndex: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  previewContent: {
    minHeight: fullWidth.height,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  previewImage: {
    width: previewSize,
    height: fullWidth.height,
  },
};

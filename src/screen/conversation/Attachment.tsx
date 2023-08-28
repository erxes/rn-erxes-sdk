/* eslint-disable react-native/no-inline-styles */
import React, { useContext } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { getAttachmentUrl } from '../../utils/utils';
import AppContext from '../../context/Context';

const fullWidth = Dimensions.get('window');
const width = fullWidth.width / 2;

const Attachment: React.FC<any> = ({ images }) => {
  const value = useContext(AppContext);

  const { subDomain } = value;
  if (!images || images.length === 0) {
    return null;
  }

  const renderImage = (
    mWidth: number | string | undefined,
    uri: string,
    index: number
  ) => {
    const url = getAttachmentUrl(uri, subDomain);
    return (
      <View key={index}>
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
      </View>
    );
  };

  if (images.length === 1) {
    return <View marginT-10>{renderImage(width, images[0].url, 0)}</View>;
  }

  if (images.length === 2) {
    return (
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
    );
  }

  if (images.length === 3) {
    return (
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
    );
  }

  if (images.length === 4) {
    return (
      <View>
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
      </View>
    );
  }

  return (
    <View>
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
    </View>
  );
};

export default Attachment;

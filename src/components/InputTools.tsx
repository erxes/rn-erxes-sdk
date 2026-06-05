import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { messengerTheme } from '../theme';
import {
  SendIcon,
  AttachmentIcon,
  MenuIcon,
  SmileyIcon,
  CloseIcon,
} from './Icons';
import EmojiPicker from './conversation/EmojiPicker';
import PersistentMenu from './conversation/PersistentMenu';
import {
  isImagePickerAvailable,
  isAllowedImageFile,
  pickImage,
  uploadFile,
  UploadedAttachment,
  unsupportedImageUploadMessage,
} from '../utils/upload';
import { getAttachmentUrl } from '../utils/utils';

// Chat composer — mirrors the web messenger ChatInput layout:
// [paperclip] [input] [smiley] [send●] [menu], inside a rounded-2xl pill, with
// an attachment strip above. Attachments/emoji/persistent-menu/file-upload all
// match the web behaviour against the same backend.
const InputTools: React.FC<any> = (props: any) => {
  const {
    onSend,
    bgColor,
    sendIcon,
    subDomain,
    persistentMenus,
    sending = false,
    placeholder = 'Reply...',
  } = props;

  const [input, onInput] = useState<string>('');
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const uploadErrorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canAttach = useMemo(() => isImagePickerAvailable(), []);
  const hasMenu = persistentMenus && persistentMenus.length > 0;

  const trimmed = input.trim();
  const canSend =
    (trimmed.length > 0 || attachments.length > 0) && !uploading && !sending;

  useEffect(() => {
    return () => {
      if (uploadErrorTimer.current) {
        clearTimeout(uploadErrorTimer.current);
      }
    };
  }, []);

  const showUploadError = (message: string) => {
    if (uploadErrorTimer.current) {
      clearTimeout(uploadErrorTimer.current);
    }

    setUploadError(message);
    uploadErrorTimer.current = setTimeout(() => {
      setUploadError('');
    }, 3500);
  };

  const handleSend = () => {
    if (!canSend) {
      return;
    }
    onSend && onSend(trimmed, attachments);
    onInput('');
    setAttachments([]);
    setShowEmoji(false);
    setShowMenu(false);
  };

  const handleAttach = async () => {
    setUploadError('');
    setShowEmoji(false);
    setShowMenu(false);
    try {
      const file = await pickImage();
      if (!file) {
        return;
      }
      if (!isAllowedImageFile(file)) {
        showUploadError(unsupportedImageUploadMessage);
        return;
      }
      setUploading(true);
      const uploaded = await uploadFile(file, subDomain);
      setAttachments((prev) => [...prev, uploaded]);
    } catch (err) {
      console.log('attachment upload failed', err);
      const message = err instanceof Error ? err.message : '';
      showUploadError(
        message.includes('Invalid configured file type')
          ? unsupportedImageUploadMessage
          : message || 'Image upload failed. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMenuSendText = (text: string) => {
    onSend && onSend(text, []);
    setShowMenu(false);
  };

  const total = attachments.length + (uploading ? 1 : 0);

  return (
    <View style={styles.wrapper}>
      {showEmoji ? (
        <EmojiPicker onSelect={(emoji) => onInput((prev) => prev + emoji)} />
      ) : null}

      {showMenu && hasMenu ? (
        <PersistentMenu
          items={persistentMenus}
          onSendText={handleMenuSendText}
        />
      ) : null}

      {uploadError ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{uploadError}</Text>
        </View>
      ) : null}

      {total > 0 ? (
        <View style={styles.strip}>
          <Text style={styles.stripLabel}>
            {uploading
              ? `${attachments.length} of ${total} uploaded`
              : `${attachments.length} attached`}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stripRow}
            keyboardShouldPersistTaps="handled"
          >
            {attachments.map((att, index) => (
              <View key={`${att.url}-${index}`} style={styles.tile}>
                {att.type?.startsWith('image/') ? (
                  <Image
                    source={{ uri: getAttachmentUrl(att.url, subDomain) }}
                    style={styles.tileImage}
                  />
                ) : (
                  <View style={styles.tileFile}>
                    <Text style={styles.tileFileText} numberOfLines={2}>
                      {att.name}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.tileRemove}
                  onPress={() => removeAttachment(index)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <CloseIcon color="#fff" size={9} />
                </TouchableOpacity>
              </View>
            ))}
            {uploading ? (
              <View style={[styles.tile, styles.tileLoading]}>
                <ActivityIndicator color={bgColor} size="small" />
              </View>
            ) : null}
          </ScrollView>
        </View>
      ) : null}

      <View style={styles.pill}>
        {canAttach ? (
          <TouchableOpacity
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            onPress={handleAttach}
          >
            <AttachmentIcon color={messengerTheme.colors.mutedText} size={18} />
          </TouchableOpacity>
        ) : null}

        <TextInput
          placeholder={placeholder}
          selectionColor={bgColor}
          underlineColorAndroid={'transparent'}
          style={styles.textInput}
          placeholderTextColor={messengerTheme.colors.mutedText}
          value={input}
          onChangeText={onInput}
          onFocus={() => {
            setShowEmoji(false);
            setShowMenu(false);
          }}
          autoCorrect={false}
          multiline
        />

        <TouchableOpacity
          style={styles.iconButton}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          onPress={() => {
            setShowEmoji((v) => !v);
            setShowMenu(false);
          }}
        >
          <SmileyIcon color={messengerTheme.colors.mutedText} size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!canSend}
          style={[
            styles.sendButton,
            { backgroundColor: bgColor },
            !canSend && styles.sendButtonDisabled,
          ]}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          onPress={handleSend}
        >
          {sendIcon || (
            <SendIcon
              color={messengerTheme.colors.primaryForeground}
              size={16}
            />
          )}
        </TouchableOpacity>

        {hasMenu ? (
          <TouchableOpacity
            style={styles.menuButton}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            onPress={() => {
              setShowMenu((v) => !v);
              setShowEmoji(false);
            }}
          >
            <MenuIcon color={messengerTheme.colors.mutedText} size={18} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: messengerTheme.spacing.sm,
    paddingTop: messengerTheme.spacing.sm,
    paddingBottom:
      Platform.OS === 'ios'
        ? messengerTheme.spacing.xl
        : messengerTheme.spacing.sm,
  },
  // rounded-2xl shadow-xs p-1.5 ps-2.5 bg-background, items aligned to the end
  // so the controls stay pinned as the input grows.
  pill: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: messengerTheme.colors.inputBackground,
    borderRadius: messengerTheme.radius.lg,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 6,
    ...messengerTheme.shadow.card,
  },
  iconButton: {
    width: 28,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    width: 32,
    height: 32,
    marginLeft: 2,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: messengerTheme.colors.text,
    paddingHorizontal: 4,
    paddingTop: 7,
    paddingBottom: 7,
    maxHeight: 120,
    minHeight: 34,
  },
  // size-8 rounded-full bg-primary
  sendButton: {
    width: 32,
    height: 32,
    marginLeft: 2,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  // Attachment strip above the composer.
  strip: {
    paddingHorizontal: 6,
    paddingBottom: messengerTheme.spacing.sm,
    gap: 6,
  },
  stripLabel: {
    fontSize: 11,
    color: messengerTheme.colors.mutedText,
  },
  toast: {
    marginHorizontal: 6,
    marginBottom: messengerTheme.spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: messengerTheme.radius.md,
    backgroundColor: '#fee2e2',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#fecaca',
  },
  toastText: {
    color: messengerTheme.colors.danger,
    fontSize: 12,
    lineHeight: 16,
  },
  stripRow: {
    flexDirection: 'row',
    gap: messengerTheme.spacing.sm,
    paddingTop: 2,
    paddingRight: 8,
  },
  tile: {
    width: 56,
    height: 56,
    borderRadius: messengerTheme.radius.md,
    backgroundColor: messengerTheme.colors.surface,
  },
  tileImage: {
    width: 56,
    height: 56,
    borderRadius: messengerTheme.radius.md,
  },
  tileFile: {
    width: 56,
    height: 56,
    borderRadius: messengerTheme.radius.md,
    backgroundColor: messengerTheme.colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: messengerTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  tileFileText: {
    fontSize: 9,
    lineHeight: 11,
    color: messengerTheme.colors.mutedText,
    textAlign: 'center',
  },
  tileLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    ...messengerTheme.shadow.card,
  },
  tileRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: messengerTheme.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});

export default InputTools;

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ViewStyle } from 'react-native';
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type ModalOptions = {
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  onRequestClose?: () => void;
  position?: 'top' | 'center' | 'bottom';
  backdropColor?: string;
  contentStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  modalStyle?: ViewStyle;
};

type ModalContextProps = {
  openModal: (content: React.ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used inside ModalProvider');
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [options, setOptions] = useState<ModalOptions>({
    transparent: true,
    animationType: 'slide',
    position: 'bottom',
    backdropColor: 'rgba(0,0,0,0.5)',
    contentStyle: {},
  });

  const animatedValue = useRef(new Animated.Value(0)).current;

  const animateIn = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const animateOut = useCallback(
    (cb?: () => void) => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        cb?.();
      });
    },
    [animatedValue]
  );

  const openModal = useCallback(
    (node: React.ReactNode, opts?: ModalOptions) => {
      setContent(node);
      if (opts) setOptions({ ...options, ...opts });
      setVisible(true);
    },
    [options]
  );

  const closeModal = useCallback(() => {
    animateOut(() => setVisible(false));
  }, [animateOut]);

  const value = useMemo(
    () => ({
      openModal,
      closeModal,
    }),
    [openModal, closeModal]
  );

  useEffect(() => {
    if (visible) {
      animatedValue.setValue(0);
      animateIn();
    }
  }, [visible, animatedValue, animateIn]);

  const getOverlayStyle = () => {
    switch (options.position) {
      case 'top':
        return styles.topOverlay;
      case 'center':
        return styles.centerOverlay;
      case 'bottom':
      default:
        return styles.bottomOverlay;
    }
  };

  const getAnimatedStyle = () => {
    switch (options.position) {
      case 'top':
        return {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-200, 0],
              }),
            },
          ],
          opacity: animatedValue,
        };
      case 'bottom':
        return {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0],
              }),
            },
          ],
          opacity: animatedValue,
        };
      case 'center':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };
    }
    return {
      opacity: animatedValue,
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        },
      ],
    };
  };

  return (
    <ModalContext.Provider value={value}>
      {children}

      <Modal
        visible={visible}
        transparent={options.transparent}
        animationType="none" // tự handle animation
        onRequestClose={options.onRequestClose || closeModal}
        style={options?.modalStyle}
      >
        <Animated.View
          style={[
            styles.overlay,
            getOverlayStyle(),
            { backgroundColor: options.backdropColor || 'rgba(0,0,0,0.5)' },
            options?.contentContainerStyle,
          ]}
        >
          {/* Backdrop (outside) */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill} // full screen clickable area
            activeOpacity={1}
            onPress={closeModal}
          />
          <Animated.View
            style={[
              styles.modalContainer,
              getAnimatedStyle(),
              options.contentStyle,
            ]}
          >
            {content}
          </Animated.View>
        </Animated.View>
      </Modal>
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  topOverlay: {
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  centerOverlay: {
    justifyContent: 'center',
  },
  bottomOverlay: {
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  modalContainer: {
    minWidth: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
});

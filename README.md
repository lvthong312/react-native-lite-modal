# react-native-fast-modal

A lightweight and flexible modal manager for React Native.  
It supports multiple positions (top, center, bottom), overlay customization, and even modal stacking.

## ✨ Features
- Simple API with hooks
- Support **top / center / bottom** modal positions
- Stack multiple modals on top of each other
- Customizable overlay color and insets
- Works with both iOS & Android

---

## 📦 Installation

```bash
npm install react-native-fast-modal
# or
yarn add react-native-fast-modal

🚀 Usage

Wrap your app with ModalProvider or ModalStackProvider:
If you wrap ModalProvider to use for useModal
If you wrap ModalStackProvider to use for useModalStack

```sh
import { Button, SafeAreaView, Text, View } from 'react-native';
import {
  ModalProvider,
  ModalStackProvider,
  useModal,
  useModalStack,
} from 'react-native-fast-modal';

const HomeScreen = () => {
  const { openModal, closeModal } = useModal();
  const { openModal: openModalStack, closeModal: closeModalStack, closeAllModal } =
    useModalStack();

  return (
    <View>
      <Button
        title="Top Modal"
        onPress={() => {
          openModal(<Text>Top modal</Text>, {
            position: 'top',
            animationType: 'none',
          });
        }}
      />
      <Button
        title="Center Modal"
        onPress={() => {
          openModal(<Text>Center modal</Text>, { position: 'center' });
        }}
      />
      <Button
        title="Bottom Modal"
        onPress={() => {
          openModal(<Text>Bottom modal</Text>, { position: 'bottom' });
        }}
      />
      <Button
        title="More Modal"
        onPress={() => {
          openModalStack(
            <Button
              title="More Modal"
              onPress={() => {
                openModalStack(<Text>Another modal</Text>, {
                  position: 'center',
                });
              }}
            />,
            { position: 'center' }
          );
        }}
      />
    </View>
  );
};

export default function App() {
  return (
    <ModalProvider>
      <ModalStackProvider>
        <SafeAreaView>
          <HomeScreen />
        </SafeAreaView>
      </ModalStackProvider>
    </ModalProvider>
  );
}

```

⚙️ API
useModal()
```sh
const { openModal, closeModal } = useModal();
```
openModal(content, options?) → Open a modal with React element

closeModal() → Close the current modal

useModalStack()
```sh
const { openModal, closeModal, closeAllModal } = useModalStack();
```
Similar to useModal but supports stacking multiple modals.

🎛 Options

When opening a modal, you can pass an options object:

Option	Type	Default	Description
position	'top' | 'center' | 'bottom'	center	Position of the modal
animationType	'fade' | 'slide' | 'none'	fade	Animation type when opening/closing
overlayColor	string	rgba(0,0,0,0.5)	Background overlay color
insets	number | { top?: number; bottom?: number; left?: number; right?: number }	0	Insets (padding from screen edges)

📌 Example

Top modal without animation
```sh
openModal(<Text>Top modal</Text>, { position: 'top', animationType: 'none' });
```

Bottom modal with custom overlay
```sh
openModal(<Text>Bottom modal</Text>, { position: 'bottom', overlayColor: 'rgba(255,0,0,0.3)' });
```

Stack multiple modals
```sh
openModalStack(<Text>First modal</Text>, { position: 'center' });
openModalStack(<Text>Second modal</Text>, { position: 'center' });
```

📝 License

MIT © ThongLuong
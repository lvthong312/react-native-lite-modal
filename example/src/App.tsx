import {
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ModalProvider,
  ModalStackProvider,
  useModal,
  useModalStack,
} from 'react-native-lite-modal';

const HomeScreen = () => {
  const {
    openModal,
    // closeModal
  } = useModal();
  const {
    openModal: openModalStack,
    // closeModal: closeModalStack,
    closeAllModal,
  } = useModalStack();

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
                openModalStack(<Text>Bottom modal</Text>, {
                  position: 'center',
                });
              }}
            />,
            { position: 'center' }
          );
        }}
      />
      <Button
        title="More Modal"
        onPress={() => {
          openModalStack(
            <Button
              title="More Modal"
              onPress={() => {
                openModalStack(
                  <TouchableOpacity
                    onPress={() => {
                      closeAllModal();
                    }}
                  >
                    <Text>Close All modal</Text>
                  </TouchableOpacity>,
                  {
                    position: 'center',
                  }
                );
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

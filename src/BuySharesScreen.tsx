import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useBuyShare } from './api';
import type { RootStackParamList } from './types';

type Props = NativeStackScreenProps<RootStackParamList, 'BuyShares'>;

export function BuySharesScreen({ route, navigation }: Props) {
  const { horse } = route.params;
  const buyShare = useBuyShare();

  const onConfirm = async () => {
    try {
      await buyShare.mutateAsync(horse.id);
      Alert.alert('Done', `You bought 1 share of ${horse.name}`);
      navigation.goBack();
    } catch (e) {}
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{horse.name}</Text>
      <Text>Price: €{(horse.sharePriceCents / 100).toFixed(2)}</Text>
      <Text>{horse.sharesLeft} shares left</Text>
      <Button title="Buy 1 share" onPress={onConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 20, fontWeight: '600' },
});

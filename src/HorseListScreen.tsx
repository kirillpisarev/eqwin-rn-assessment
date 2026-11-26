import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { searchHorses, useHorses } from './api';
import type { Horse, RootStackParamList } from './types';

function formatTimeLeft(s: number) {
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s`;
}

function HorseRow({ horse, onPress }: { horse: Horse; onPress: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(horse.saleEndsAt).getTime() - Date.now()) / 1000)),
  );

  useEffect(() => {
    setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
  }, []);

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={styles.name}>{horse.name}</Text>
      <Text>
        €{(horse.sharePriceCents / 100).toFixed(2)} · {horse.sharesLeft} shares left
      </Text>
      <Text>Ends in {formatTimeLeft(secondsLeft)}</Text>
    </Pressable>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'HorseList'>;

export function HorseListScreen({ navigation }: Props) {
  const { data } = useHorses();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Horse[] | null>(null);

  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }
    searchHorses(query).then(setResults);
  }, [query]);

  const horses = results ?? data ?? [];

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.search}
        placeholder="Search horses"
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={horses}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item }) => (
          <HorseRow horse={item} onPress={() => navigation.navigate('BuyShares', { horse: item })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  search: { margin: 12, padding: 8, borderWidth: 1, borderRadius: 8 },
  row: { padding: 12 },
  name: { fontSize: 16, fontWeight: '600' },
});

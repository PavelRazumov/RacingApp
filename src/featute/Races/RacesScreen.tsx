import { FC, useCallback, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector, useViewportUnits } from '../../app/hooks';
import { clearRace, fetchRacesThunk, RaceModel, selectRaces, selectRacesLoading } from './slice/racesSlice.ts';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { RACE_LIMIT } from './slice/constants.ts';

type RacesScreenScreenProps = StackScreenProps<RootStackParamList, 'Races'>;

export const RacesScreen: FC<RacesScreenScreenProps> = ({ route }) => {
    const driverId = route.params?.id;
    const dispatch = useAppDispatch();
    const [offset, setOffset] = useState(0);
    const { vh } = useViewportUnits();
    const races = useAppSelector(selectRaces);
    const loading = useAppSelector(selectRacesLoading);

    useEffect(() => {
        if (driverId) {
            console.log('driverId - ', driverId);
            dispatch(fetchRacesThunk({ id: driverId, page: offset }));
        }
    }, [dispatch, driverId, offset]);

    useEffect(() => {
        return () => {
            dispatch(clearRace());
        };
    }, [dispatch]);

    // @ts-ignore
    const loadMore = useCallback(({ distanceFromEnd }) => {
        if (distanceFromEnd <= 0) {
            return;
        }

        setOffset((prev) => prev + RACE_LIMIT);
    }, []);

    const renderItem = useCallback(({ item }: { item: RaceModel }) => {
        return (
            <View style={styles.card}>
                <Text style={{ fontSize: 32, color: '#000', fontWeight: 'bold' }}>{item.raceName}</Text>
                <View>
                    <View>
                        <Text>Season: {item.season}</Text>
                    </View>
                    <View>
                        <Text>Date: {item.date}</Text>
                    </View>
                    <View>
                        <Text>Round: {item.round}</Text>
                    </View>
                </View>
            </View>
        );
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={{ flex: 1, height: vh }}>
                {loading && offset === 0 ? (
                    <Text style={styles.loading}>Loading ....</Text>
                ) : (
                    <FlatList
                        data={races}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${index}-${item?.season}-${item?.date}}`}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.8}
                        ListFooterComponent={loading ? <Text style={styles.loading}>Loading ....</Text> : null}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        paddingHorizontal: 16,
    },
    loading: {
        fontSize: 12,
        color: '#000',
    },
    card: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginBottom: 16,
        borderRadius: 10,
    },
});

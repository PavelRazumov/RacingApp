import { Button, FlatList, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector, useViewportUnits } from '../../app/hooks';
import { fetchDriversThunk, selectDriversLoading, selectDrivers } from './slice/driverSlice.ts';
import { FC, useCallback, useEffect, useState } from 'react';
import { LIMIT } from './slice/contants.ts';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App.tsx';

type DriverScreenProps = StackScreenProps<RootStackParamList, 'Drivers'>;

export const DriverScreen: FC<DriverScreenProps> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const drivers = useAppSelector(selectDrivers);
    const loading = useAppSelector(selectDriversLoading);
    const [offset, setOffset] = useState(0);
    const { vh } = useViewportUnits();

    console.log('drivers - ', drivers);
    useEffect(() => {
        dispatch(fetchDriversThunk(offset));
    }, [dispatch, offset]);

    const renderItem = useCallback(
        ({ item }) => {
            const fullName = `${item.givenName} ${item.familyName}`;
            return (
                <View style={styles.item}>
                    <Pressable
                        style={{ marginBottom: 16 }}
                        onPress={() => navigation.push('DriverDetails', { id: item.driverId })}
                    >
                        <Text style={styles.name}>
                            {fullName}({item.nationality})
                        </Text>
                    </Pressable>

                    <Button title={'Races'} onPress={() => navigation.push('Races', { id: item.driverId })} />
                </View>
            );
        },
        [navigation],
    );

    const loadMore = useCallback(({ distanceFromEnd }: { distanceFromEnd: number }) => {
        if (distanceFromEnd <= 0) {
            return;
        }

        setOffset((prev) => prev + LIMIT);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, height: vh }}>
                <FlatList
                    initialNumToRender={5}
                    data={drivers}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.driverId}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.8}
                    ListFooterComponent={loading ? <Text style={styles.loading}>Loading ....</Text> : null}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        borderRadius: 10,
    },
    label: {
        fontSize: 32,
        color: '#000',
    },
    name: {
        fontSize: 24,
    },
    nationality: {
        fontSize: 24,
    },
    loading: {
        fontSize: 12,
        color: '#000',
    },
});

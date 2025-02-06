import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, View, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App.tsx';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchDriverDetailsThunk, selectDriver, selectDriverDetailsLoading } from './slice/driverDetailsSlice.ts';

type DriverDetailScreenProps = StackScreenProps<RootStackParamList, 'DriverDetails'>;

export const DriverDetailScreen: FC<DriverDetailScreenProps> = ({ route }) => {
    const id = route.params?.id;
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectDriverDetailsLoading);
    const driverInfo = useAppSelector(selectDriver);

    console.log('loading - ', loading);
    useEffect(() => {
        if (id) {
            console.log('Dispatch');
            dispatch(fetchDriverDetailsThunk(id));
        }
    }, [dispatch, id]);

    const renderInfo = () => {
        return (
            <View style={styles.card}>
                <Text style={styles.cardText}>Id: {driverInfo?.driverId}</Text>
                <Text style={styles.cardText}>Date of birth: {driverInfo?.dateOfBirth}</Text>
                <Text style={styles.cardText}>
                    Name: {driverInfo?.familyName} {driverInfo?.givenName}
                </Text>
                <Text style={styles.cardText}>Nationality: {driverInfo?.nationality}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? <Text style={styles.loading}>Loading ....</Text> : renderInfo()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    loading: {
        fontSize: 12,
        color: '#000',
    },
    card: {
        display: 'flex',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    cardText: {
        fontSize: 16,
        lineHeight: 14,
    },
});

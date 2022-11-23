import React, {useEffect, useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/core';
import {useTheme, useTranslation} from '../hooks';
import {Block, Button, Input, Product} from '../components';
import {instance} from '../service/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IProduct} from '../constants/types';
import {useIsFocused} from '@react-navigation/native';
const Home = () => {
  const {t} = useTranslation();
  const [products, setProducts] = useState([] as IProduct[]);
  const {colors, sizes} = useTheme();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    // console.log('FUcusl');
    if (isFocused === true) {
      setTimeout(async () => {
        const fetch = async () => {
          let userToken;
          userToken = null;
          try {
            userToken = await AsyncStorage.getItem('userToken');
            const response = await instance.get('posts', {
              method: 'get',
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            });
            if (
              response.data !== undefined ||
              response !== undefined ||
              response
            ) {
              setProducts(response.data);
            }
          } catch (e) {
            console.log(e);
          } finally {
          }
        };
        fetch();
      });
    } else {
      setProducts([]);
    }
  }, [isFocused]);

  return (
    <Block>
      {/* search input */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t('common.search')} />
      </Block>

      {/* products list */}
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.l}}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {isFocused === true
            ? products?.map((product) => (
                <Product {...product} key={`card-${product?.id}`} />
              ))
            : null}
        </Block>
      </Block>
      <Button
        primary
        shadow={false}
        radius={sizes.xl}
        style={{
          position: 'absolute',
          left: '80%',
          top: '88%',
        }}
        width={40}
        height={40}
        onPress={() => navigation.navigate('Post')}>
        <Ionicons size={40} name="add" color={colors.white} />
      </Button>
    </Block>
  );
};

export default Home;

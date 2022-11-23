/* eslint-disable react-hooks/rules-of-hooks */
import React, {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useData, useTheme, useTranslation} from '../hooks';
import * as regex from '../constants/regex';
import {Block, Button, Input, Text, InputArea, Image} from '../components';
import {instance} from '../service/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PostContext} from '../hooks/context';

const isAndroid = Platform.OS === 'android';

interface ICreateOrUpdate {
  title: string;
  content: string;
  image: string;
}
interface ICreateOrUpdateValidation {
  title: boolean;
  content: boolean;
  image: boolean;
}

const createOrUpdatePost = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState<ICreateOrUpdateValidation>({
    title: false,
    content: false,
    image: false,
  });
  const [form, setPost] = useState<ICreateOrUpdate>({
    title: '',
    content: '',
    image: '',
  });
  const {colors, gradients, sizes, assets} = useTheme();

  const handleChange = useCallback(
    (value) => {
      setPost((state) => ({...state, ...value}));
    },
    [setPost],
  );

  const handleSignIn = async () => {
    if (!Object.values(isValid).includes(false)) {
      /** send/save registratin data */
      const userToken = await AsyncStorage.getItem('userToken');
      await instance
        .create({
          headers: {Authorization: 'Bearer ' + userToken},
        })
        .post('posts', form)
        .then(function (response: any) {
          navigation.goBack();
        })
        .catch(function (error: any) {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      content: regex.name.test(form.content),
      title: regex.name.test(form.title),
      image: regex.name.test(form.image),
    }));
  }, [form, setIsValid]);

  return (
    <Block safe marginTop={sizes.md}>
      <Block scroll showsVerticalScrollIndicator={false}>
        {/* login form */}
        <Block keyboard behavior={!isAndroid ? 'padding' : 'height'}>
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Button
                row
                flex={0}
                justify="flex-start"
                onPress={() => navigation.goBack()}>
                <Image
                  radius={0}
                  width={10}
                  height={10}
                  marginLeft={18}
                  color={colors.black}
                  source={assets.arrow}
                  transform={[{rotate: '180deg'}]}
                />
                <Text marginLeft={sizes.s}>{t('post.subtitle')}</Text>
                <Button onPress={handleSignIn} marginLeft={240}>
                  <Text p>{t('post.save')}</Text>
                </Button>
              </Button>
              {/* social buttons */}
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('post.title')}
                  placeholder={t('post.titlePlaceholder')}
                  success={Boolean(form.title && isValid.title)}
                  danger={Boolean(form.title && !isValid.title)}
                  onChangeText={(value) => handleChange({title: value})}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('post.image')}
                  placeholder={t('post.imagePlaceholder')}
                  onChangeText={(value) => handleChange({image: value})}
                  success={Boolean(form.image && isValid.image)}
                  danger={Boolean(form.image && !isValid.image)}
                />
                <InputArea
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('post.content')}
                  placeholder={t('post.contentPlaceholder')}
                  onChangeText={(value) => handleChange({content: value})}
                  success={Boolean(form.content && isValid.content)}
                  danger={Boolean(form.content && !isValid.content)}
                />
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default createOrUpdatePost;

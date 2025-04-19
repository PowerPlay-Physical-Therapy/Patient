import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Streak from '@/components/streak';

type ScreenHeaderProps = {
  title?: string;
  name?: string | null;
  logo?: boolean;
  streak?: boolean;
};

const ScreenHeader = ({ title, name, logo = false, streak=false }: ScreenHeaderProps) => {
  return (
    <View style={styles.header}>
      
          {logo ? (
            <View style={styles.logoRow}>
              {streak &&<Streak/>}
              <ThemedText style={!streak? styles.headerText : {fontSize: 20,
    fontWeight: 'bold',
    color: 'black',}}>{title} {name}</ThemedText>
              <Image
                source={require('@/assets/images/app-logo.png')}
                resizeMode="contain"
                style={styles.image}
              />
            </View>
          ) : (
            <ThemedText style={styles.headerText}>{title} {name}</ThemedText>
          )}
        
      
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    paddingTop: 30,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 24,
  },
  headerRow: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  image: {
    width: 40,
    height: 40,
    marginLeft: 20,
    position: 'relative',
    bottom: 12
  },
});

export default ScreenHeader;
